# Capstone Reflection

### 1. What was hardest and why?
The hardest part of this project was managing the unpredictability of an external LLM dependency (Gemini 503 failures) while ensuring a strictly structured JSON response for a medical context. Structuring the prompt to absolutely refuse diagnosing while consistently returning perfectly structured arrays of symptoms and missing info required careful tuning. Furthermore, making sure the UI never crashes or blocks the core product workflow when that external AI service goes down required a robust bounded retry and safe-failure design pattern.

### 2. What would you do differently?
If I were to start over, I would adopt a state machine approach (like XState) for the core referral form. Handling the complex async states of fetching location, pinging the backend AI, parsing JSON, and merging it with manual user inputs led to some heavily chained React effects. A formal state machine would make the "AI Failed -> Switch to Manual Mode" transition mathematically verifiable.

### 3. One thing you learned that surprised you.
I was surprised by how much of an impact code-splitting the interactive map (`React.lazy` on Leaflet) had on the Lighthouse Performance score. I assumed the bulk of the lag was from React rendering the complex portal layout, but moving the map out of the main initial bundle completely eliminated the main-thread blocking bottleneck on mobile devices, taking us to a 95 Performance score without needing to strip out any visual fidelity.
