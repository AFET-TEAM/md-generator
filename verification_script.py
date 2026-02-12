from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to app
        page.goto("http://localhost:3000")

        # 2. Switch to Multi-Agent mode
        page.click("text=Multi-Agent Yapilandirma")

        # 3. Fill Project Form (Minimal required fields)
        # Select Category: Frontend
        page.select_option("#project_category", "frontend")

        # Select Type: Web Application
        page.select_option("#project_type", "Web Application")

        # Select Framework: React (required for frontend category)
        page.select_option("#frontend_framework", "React")

        # Submit Form
        page.click("button[type=submit]")

        # 4. Wait for Configurator
        # Look for "Ajanlar (1)" or similar
        expect(page.locator("text=Ajanlar (1)")).to_be_visible()

        # 5. Interact with Agent Card
        # Find the first agent card input
        name_input = page.locator("input[placeholder='Ornegin: Kod Asistani']").first
        name_input.fill("Bolt Optimized Agent")

        # 6. Add another agent
        page.click("text=+ Bos Ajan Ekle")
        expect(page.locator("text=Ajanlar (2)")).to_be_visible()

        # 7. Type in second agent
        inputs = page.locator("input[placeholder='Ornegin: Kod Asistani']")
        inputs.nth(1).fill("Second Agent")

        # 8. Verify values
        expect(inputs.nth(0)).to_have_value("Bolt Optimized Agent")
        expect(inputs.nth(1)).to_have_value("Second Agent")

        # 9. Screenshot
        page.screenshot(path="verification.png")

        browser.close()

if __name__ == "__main__":
    run()
