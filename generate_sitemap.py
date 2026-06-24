import os
import xml.etree.ElementTree as ET
from datetime import datetime

def generate_sitemap(base_url, directory):
    # 1. Create the root <urlset> element with standard Google namespaces
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    # 2. Walk through the local directory looking for HTML files
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".html"):
                # Get the file path relative to the root folder
                filepath = os.path.relpath(os.path.join(root, file), directory)
                
                # Convert Windows backslashes to URL forward slashes
                url_path = filepath.replace("\\", "/")
                
                # Clean up URLs (Remove index.html for cleaner root URLs)
                if url_path == "index.html":
                    url_path = ""
                elif url_path.endswith("/index.html"):
                    url_path = url_path.replace("/index.html", "/")
                else:
                    # Optional: Remove .html if your server uses clean URLs
                    url_path = url_path.replace(".html", "") 

                # Construct the full URL
                full_url = f"{base_url}/{url_path}".rstrip('/')

                # 3. Build the XML elements for this specific URL
                url_element = ET.SubElement(urlset, "url")
                
                # <loc> - The actual URL
                loc = ET.SubElement(url_element, "loc")
                loc.text = full_url
                
                # <lastmod> - Pulls the actual last modified date from the file on your computer
                lastmod = ET.SubElement(url_element, "lastmod")
                file_stat = os.stat(os.path.join(root, file))
                lastmod.text = datetime.fromtimestamp(file_stat.st_mtime).strftime('%Y-%m-%d')
                
                # <priority> - Gives the homepage higher priority than subpages
                priority = ET.SubElement(url_element, "priority")
                priority.text = "1.00" if url_path == "" else "0.80"

    # 4. Generate the XML tree and format it
    tree = ET.ElementTree(urlset)
    ET.indent(tree, space="  ", level=0) # Formats the XML nicely with line breaks
    
    # 5. Write to the sitemap.xml file
    output_filename = "sitemap.xml"
    tree.write(output_filename, encoding="utf-8", xml_declaration=True)
    print(f"✅ Successfully generated {output_filename} with {len(urlset)} URLs.")

# ==========================================
# CONFIGURATION - CHANGE THESE VARIABLES
# ==========================================
BASE_DOMAIN = "https://www.kidsfunlearnhub.com"  # Replace with your actual domain
LOCAL_SITE_FOLDER = "./"                    # './' scans the folder the script is currently in

if __name__ == "__main__":
    generate_sitemap(BASE_DOMAIN, LOCAL_SITE_FOLDER)