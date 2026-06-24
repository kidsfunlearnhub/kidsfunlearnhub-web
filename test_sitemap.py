import xml.etree.ElementTree as ET
import requests

def test_sitemap_links(sitemap_file):
    print(f"🔍 Reading {sitemap_file}...")
    
    try:
        tree = ET.parse(sitemap_file)
        root = tree.getroot()
    except FileNotFoundError:
        print("❌ sitemap.xml not found. Please run the generator script first.")
        return

    # Define the namespace used in standard sitemaps
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = root.findall('ns:url/ns:loc', namespace)

    print(f"🌐 Found {len(urls)} URLs. Testing connections...\n")

    broken_links = 0
    for url_element in urls:
        url = url_element.text
        try:
            # We use a HEAD request to check the status without downloading the whole page
            response = requests.head(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ [200 OK] {url}")
            else:
                print(f"❌ [{response.status_code}] Broken or Redirected: {url}")
                broken_links += 1
        except requests.exceptions.RequestException as e:
            print(f"⚠️ [Error] Could not reach {url}. Reason: {e}")
            broken_links += 1

    print("\n📊 --- Summary ---")
    if broken_links == 0:
        print("🎉 All links in the sitemap are working perfectly!")
    else:
        print(f"⚠️ Found {broken_links} problematic links. Please fix them before applying to AdSense.")

if __name__ == "__main__":
    # Ensure your website is actually uploaded and live before running this!
    test_sitemap_links("sitemap.xml")