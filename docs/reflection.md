# Project Reflection

Reflecting on the MediBridge capstone project journey, the process transformed a promising prototype into a production-ready application. 

## Technical Challenges Overcome
1. **AI Determinism**: Getting Gemini to return consistent, structured data was initially challenging. Moving from standard text prompts to utilizing the `responseSchema` property with `application/json` was a game-changer, allowing the frontend to confidently parse and render the AI's output without complex regex or error-prone string manipulation.
2. **Testing Environments**: Setting up Vitest to run reliably without worker timeouts on Windows required specific pool configurations (`singleThread`).
3. **Security Constraints**: Auditing the project revealed that API keys could easily leak if not careful. By strictly segregating the Gemini API calls to the Express backend and explicitly `.gitignore`ing the `server/.env` file, we ensured production safety.

## Learnings
- **Accessibility is not optional**: Adding `aria-labels` and semantic markup is critical for healthcare applications, as users may be in high-stress situations or relying on assistive technologies.
- **Fail Gracefully**: AI features are powerful but fallible. Building the AI Referral Assistant such that it falls back gracefully when the API fails (allowing manual entry) ensures the core business workflow is never blocked.

## Future Outlook
MediBridge is well-positioned for pilot testing. The next phase will focus on comprehensive offline-first capabilities using Service Workers, as rural healthcare clinics frequently face intermittent internet connectivity. Furthermore, refining Firestore security rules for a multi-tenant environment (where different hospitals cannot see each other's patients) will be essential for real-world scaling.
