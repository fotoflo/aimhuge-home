---
description: Extract images or files uploaded directly to the AI chat interface into the local workspace.
---

When the user uploads images or files directly into the AI chat interface, they are not automatically saved into the project's codebase. They are instead stored in the AI's ephemeral "brain" directory as conversation artifacts.

To extract these chat uploads into the project directory (like `public/images/`), follow these steps:

1. **Locate the Artifacts Directory:** 
   Use the `App Data Directory` and `Conversation ID` provided in your system state/context blocks.
   The path formula is: `<App Data Directory>/brain/<Conversation ID>/`
   Example: `/Users/fotoflo/.gemini/antigravity/brain/83cc8717-426a-4e8b-8c7a-bef194f34f6f/`

2. **List the Available Uploads:**
   Use the `list_dir` tool to inspect the contents of that directory. The uploaded media files are typically prefixed with `media__` and have a timestamp (e.g., `media__1774930619049.jpg`).

3. **Copy the Files to the Workspace:**
   Use the `run_command` tool to securely copy (`cp`) the identified artifact files into the desired location within the project workspace, such as `public/images/events/`.

   *Example Command:*
   ```bash
   mkdir -p public/images/events && cp /Users/fotoflo/.gemini/antigravity/brain/<Conversation ID>/media__*.jpg public/images/events/
   ```

4. **Rename for Clarity (Optional but recommended):**
   Once copied, rename the verbose timestamped files to descriptive, human-readable names (e.g., `1.jpg`, `fang-truck.jpg`, `founders-dinner.jpg`) to maintain a clean codebase before injecting them into code.
