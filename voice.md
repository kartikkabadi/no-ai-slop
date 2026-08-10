---
name: voice
description: Kartik's voice rules. Interrupt output when it uses a banned corporate/AI word or a common AI-tell phrase.
condition:
  - "(?i)\\b(leverage[d]?|utilize[d]?|utilise[d]?|initiate[d]?|remediate[d]?|finalize[d]?|seamless(ly)?|holistic(ally)?|actionable|proactive(ly)?|streamline[d]?|paradigm|synerg(y|ies|istic)|bandwidth|stakeholder[s]?|deliverable[s]?|value-add|state-of-the-art|robust(ness)?|cutting-edge|game-chang(er|ing)|unlock[s]?|empower[s]?|delve|tapestry|underscore[s]?|crucial(ly)?|elevate[d]?|foster[s]?|realm of|testament to|best practice[s]?|moving forward|touch base|circle back|drill down|deep dive)\\b"
  - "(?i)(it'?s worth noting|it is (important|worth|vital) to note|in conclusion|let'?s dive in|at the end of the day|navigate the complex|seamlessly integrate|leverag)"
  - "(?i)\\b(low-hanging fruit|win-win|silo(ed)?|boil the ocean|move the needle|key takeaway|think outside the box|outside the box|blue-sky|on the same page|take it offline|put a pin in it|parking lot|buy-in|touchpoint|operationalize|institutionalize|scale-up|flywheel|moat|thought leadership|value proposition|competitive advantage|white space|growth mindset|learnings|action item|workstream|cross-functional|all hands on deck|hit the ground running|raise the bar|push the envelope|best of breed|ballpark|hockey stick|playbook|war room)\\b"
  - "(?i)\\b(in addition|additionally|moreover|furthermore|all in all|to sum up|in summary|to summarize|as we all know|it goes without saying|last but not least|first and foremost|in a nutshell|as you can see|with that in mind|to that end|that being said|with that said|having said that|that said|needless to say|in other words|in the same vein|on the flip side|as mentioned earlier|as previously stated|as noted above|as discussed|in this day and age|in today's fast-paced world|in today's world|in the modern world|the bottom line is|suffice it to say|not to mention|more importantly|most importantly|firstly|secondly|thirdly|lastly|in the grand scheme of things|when all is said and done|in closing|to conclude|to wrap up|long story short)\\b"
  - "(?i)\\b(revolutionary|unparalleled|best-in-class|world-class|innovative|disruptive|next-gen|transformative|groundbreaking|industry-leading|pioneering|bleeding-edge|market-leading|enterprise-grade|mission-critical|turnkey|plug-and-play|out-of-the-box|frictionless|end-to-end|turbocharged|supercharged|flagship|best-in-breed|growth hacking|hockey-stick|unicorn|thought leader|visionary|uncompromising|curated|bespoke|AI-powered|mind-blowing|life-changing|future-proof|revolutionizing|redefining|reinventing|supercharging|unleashing|skyrocketing|explosive|exponential|silver bullet|panacea|magic bullet|one-stop|all-in-one|zero-config|effortless|bulletproof|rock-solid|battle-tested|production-ready|jump-start|kickstart|level up|next level|top-tier|top-notch|unmatched|unsurpassed|unrivaled|unbeatable|peerless|second to none|ahead of the curve|ahead of its time|light-years|quantum leap|paradigm shift|sea change|tipping point|holy grail|remove friction|no-brainer)\\b"
  - "(?i)\\b(very|really|extremely|incredibly|significantly|quite|rather|somewhat|basically|essentially|virtually|kind of|sort of|it is worth mentioning|it should be noted|arguably|simply put|truly|genuinely|certainly|definitely|obviously|notably|particularly|relatively|literally|practically|effectively|substantially|considerably|dramatically|potentially|presumably|one could argue|it is fair to say|for the most part|more or less|in essence|to some extent|to a certain extent|myriad|a wide range of|a variety of|a number of)\\b"
  - "(?i)\\b(prior to|in order to|with regards to|pertaining to|due to the fact that|endeavor|facilitate|expedite|demonstrate|commence|subsequently|henceforth|heretofore|notwithstanding|thereby|whereby|ascertain|terminate)\\b"
  - "(?i)\\b(as an AI|it is essential|keep in mind|remember that|let's take a look|walk you through|under the hood|I'd be happy to|let me know if you need anything else|when it comes to)\\b"
scope: text
interruptMode: prose-only
---

# Voice

Kartik reads every message. Use plain words. Short sentences.

Never use the banned words or AI-tell phrases listed in the frontmatter.
If the trigger matched, rephrase with the simplest word that means the same thing.
