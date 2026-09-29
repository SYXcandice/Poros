"""Validate local references without third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.references = []
        self.errors = []

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.errors.append(f"Duplicate ID: {attrs['id']}")
            self.ids.add(attrs["id"])
        for key in ("href", "src", "data-figure"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if tag == "img" and "alt" not in attrs:
            self.errors.append(f"Missing image alternative text: {attrs.get('src')}")


parser = SiteParser()
parser.feed((ROOT / "index.html").read_text())
for ref in parser.references:
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        continue
    if url.path and not (ROOT / unquote(url.path)).is_file():
        parser.errors.append(f"Missing local asset: {ref}")
    if not url.path and url.fragment and url.fragment not in parser.ids:
        parser.errors.append(f"Missing anchor target: {ref}")

if parser.errors:
    raise SystemExit("\n".join(parser.errors))
print(f"Site checks passed: {len(parser.ids)} IDs, {len(parser.references)} references.")
