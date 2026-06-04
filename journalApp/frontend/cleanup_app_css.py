import re
from pathlib import Path
path = Path(r'c:\Users\gagan\Downloads\journalApp\journalApp\frontend\src\styles\app.css')
text = path.read_text(encoding='utf-8')
text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
text = re.sub(r'\n*\.dash-controls-card input\[type="text"\],\s*\.dash-search-container input\[type="text"\] \{.*?\}\n*', '\n', text, flags=re.S)
text = re.sub(r'\n*\.dash-controls-card input\[type="text"\]:focus,\s*\.dash-search-container input\[type="text"\]:focus \{.*?\}\n*', '\n', text, flags=re.S)
text = re.sub(r'\n{3,}', '\n\n', text)
path.write_text(text.strip() + '\n', encoding='utf-8')
