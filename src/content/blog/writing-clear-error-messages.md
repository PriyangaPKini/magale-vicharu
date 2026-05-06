---
title: "Writing Clear Error Messages"
date: "2026-03-28"
description: "How to write error messages that actually help users understand and recover from problems."
tags: ["engineering", "ux"]
---

Error messages are a critical part of user experience, yet many applications treat them as an afterthought. A good error message can transform frustration into clarity. A bad one leaves users confused and helpless.

## What Makes an Error Message Bad?

Most error messages fail because they:

- **Blame the user** — "Invalid input" instead of "Enter a valid email address"
- **Use jargon** — "NullPointerException" means nothing to most users
- **Hide the problem** — Generic messages that don't explain what went wrong
- **Lack guidance** — No suggestion for how to fix the issue

## Principles for Better Error Messages

### 1. Be Specific

Instead of: "Error: Invalid data"

Write: "Password must be at least 8 characters long"

### 2. Use Plain Language

Instead of: "ECONNREFUSED: Connection refused"

Write: "Unable to reach the server. Please check your internet connection and try again."

### 3. Show the Context

When showing an error, include what input caused it:

```
Error in line 5: Missing closing quotation mark
Line 5: const name = "John
                      ^
```

### 4. Offer a Solution

Instead of: "File upload failed"

Write: "File upload failed. Make sure your file is less than 10MB and in PDF format."

### 5. Use a Conversational Tone

Instead of: "ERROR CODE 403: UNAUTHORIZED ACCESS DETECTED"

Write: "Oops! You don't have permission to access this resource. Sign in with the correct account."

## Examples of Good Error Messages

**Stripe's error messages** are exemplary:

- Clear about what failed
- Specific about the requirement
- Include error codes for developers
- Link to documentation

**1Password's approach** is empathetic:

- Acknowledges the frustration
- Explains the problem in simple terms
- Provides clear next steps

## Implementation Tips

- **Test your messages** — Ask users if they understand what went wrong
- **Be consistent** — Use the same terminology across your app
- **Use colour wisely** — Red for errors, but don't rely on colour alone
- **Log and monitor** — Track which errors users encounter most
- **Iterate** — Error messages can be improved based on user feedback

## The Goal

A good error message is a conversation between your application and the user. It should be helpful, honest, and human. When done well, users won't dread errors—they'll appreciate the clarity and move forward with confidence.

Remember: An error message is your chance to turn a negative experience into a positive one.
