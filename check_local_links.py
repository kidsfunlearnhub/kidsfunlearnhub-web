import os
import urllib.parse
from bs4 import BeautifulSoup

def check_local_internal_links(directory):
    print(f"🔍 Scanning local directory: {directory}\n")
    broken_links_found = 0

    # 1. Walk through all folders and subfolders
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                current_file_path = os.path.join(root, file)
                
                # Open and parse the HTML file
                with open(current_file_path, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f, "html.parser")
                
                # 2. Find all anchor <a> tags
                for a_tag in soup.find_all("a"):
                    href = a_tag.get("href")
                    
                    if not href:
                        continue
                        
                    # 3. Filter out external links, emails, and phone numbers
                    if href.startswith(("http", "https", "mailto:", "tel:", "javascript:")):
                        continue
                        
                    # Ignore pure anchor links on the same page (e.g., href="#top")
                    if href.startswith("#"):
                        continue
                        
                    # Strip anchor tags AND query parameters for local checking
                    # e.g., page.html?topic=hindi#section -> page.html
                    clean_href = href.split("#")[0].split("?")[0]
                    
                    if not clean_href:
                        continue

                    # 4. Resolve the local path
                    target_path = os.path.normpath(os.path.join(root, urllib.parse.unquote(clean_href)))
                    
                    # If the link points to a folder, assume it looks for index.html
                    if os.path.isdir(target_path):
                        target_path = os.path.join(target_path, "index.html")

                    # 5. Check if the file physically exists on your hard drive
                    if not os.path.exists(target_path):
                        print(f"❌ Broken Link found in: {current_file_path}")
                        print(f"   --> Missing Target: '{href}' (Evaluated as {target_path})")
                        broken_links_found += 1

    # 6. Final Summary
    print("\n📊 --- Local Scan Summary ---")
    if broken_links_found == 0:
        print("🎉 All internal local links are perfectly intact!")
    else:
        print(f"⚠️ Found {broken_links_found} broken internal links. Please fix these before deploying.")

# ==========================================
# CONFIGURATION
# ==========================================
LOCAL_SITE_FOLDER = "./"  

if __name__ == "__main__":
    check_local_internal_links(LOCAL_SITE_FOLDER)