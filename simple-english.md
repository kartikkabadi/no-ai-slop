---
name: simple-english
description: Always write in Simplified Technical English (STE-100). Interrupt output that uses long words, filler phrases, or complex sentences.
alwaysApply: true
condition:
  - "(?i)\\b(approximately|additional|assistance|considerable|currently|determine|establish|frequently|immediately|individual|numerous|obtain|perform|provide|purchase|regarding|request|require|sufficient|subsequent|therefore|implement|indicate|initial|eventually|ultimately|appropriate|attempt|complete|conclude|construct|desire|difficult|display|eliminate|encounter|evident|fabricate|generate|identical|inform|investigate|locate|maintain|modify|notify|occur|portion|possess|previous|primary|proceed|receive|remain|remove|reside|retain|reveal|transmit|verify|withdraw)\\b"
  - "(?i)\\b(in terms of|with respect to|with regard to|as far as .* is concerned|at this point in time|in the near future|at the present time|the fact that|in a manner that|the majority of|in the process of|for the purpose of|in the event that|in the vicinity of|with the exception of|on a daily basis|on a regular basis|in a timely manner|at a later date|in the amount of|take into consideration|give consideration to|make a decision|make an attempt|make use of|put in place|come to a conclusion|draw to a close)\\b"
scope: text
interruptMode: prose-only
---

# Simple English

Write in Simplified Technical English (STE-100). A human reads every message.

Use the shortest word that means the same thing. Use short sentences. Put one idea in each sentence. Do not use long words when a short word works. Do not use jargon. Do not use corporate or AI phrases. Do not make things confusing. Say exactly what you mean, plainly. When in doubt, choose the simpler word.

Lead with the conclusion. Give the context needed to understand it. Use the active voice. Do not use metaphors or figures of speech.

If a trigger fires, rephrase with the simplest word that means the same thing.
