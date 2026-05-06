---
title: "Temporal anti-pattern: Don't treat expected failures as exceptions"
date: "2026-04-30"
description: "Why business failures deserve to be modelled as first-class outcomes, not exceptions — a Temporal workflow pattern."
tags: ["temporal", "engineering"]
externalUrl: "https://blog.nilenso.com/blog/2026/04/30/business-errors-are-outcomes-not-exceptions/"
---

*Cross-posted from [Nilenso Blog](https://blog.nilenso.com/blog/2026/04/30/business-errors-are-outcomes-not-exceptions/).*

We were building a partner onboarding system for a logistics platform that processes identity document verification. The team needed to accelerate onboarding from 3-4 days to same-day completion using Temporal, a durable execution framework.

## The Problem

Initially, the validation logic threw exceptions for expected business failures:

```kotlin
fun validateDocument(extractedData: ExtractedData): Boolean {
    if (extractedData.documentNumber == null) {
        throw ValidationException("Document number not found")
    }
    // ... additional validation
    return true
}
```

The workflow caught these as infrastructure failures:

```kotlin
override fun processDocument(document: Document) {
    try {
        val extractedData = activities.runOcr(document)
        activities.validateDocument(extractedData)
        markVerified(document.id)
    } catch (e: ActivityFailure) {
        markRejected(document.id, e.cause?.message)
    }
}
```

A partner uploading a blurry photo looks the same as a network timeout when exceptions represent expected rejections.

## The Solution

Return validation outcomes as explicit data types rather than exceptions:

```kotlin
sealed class ValidationResult {
    data class Verified(val data: VerifiedData) : ValidationResult()
    data class Rejected(val reason: String) : ValidationResult()
}
```

This enables clear business logic separation:

```kotlin
override fun processDocument(document: Document) {
    val extractedData = activities.runOcr(document)
    val result = activities.validateDocument(extractedData)
    when (result) {
        is ValidationResult.Verified -> markVerified(document.id)
        is ValidationResult.Rejected -> handleRejection(document.id, result.reason)
    }
}
```

Business failures are part of the domain. They deserve to be modelled as first-class outcomes — code that models outcomes explicitly grows with the business instead of fighting against it.
