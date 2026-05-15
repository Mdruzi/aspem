with open("data.js", "rb") as f:
    content = f.read()

# Find the last occurrence of the alert helper closing brace
marker = b"return getRequisitions().filter(r =>\r\n    (r.status === 'aprovado' || r.status === 'cotacao') && !r.estimatedDelivery\r\n  ).length;\r\n}"
idx = content.find(marker)

if idx != -1:
    new_content = content[:idx + len(marker)] + b"\n\n// \xe2\x94\x80\xe2\x94\x80 PERMISSIONS \xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\xe2\x94\x80\nfunction getPermissions() {\n  const stored = localStorage.getItem(KEYS.permissions);\n  if (!stored) { localStorage.setItem(KEYS.permissions, JSON.stringify(DEFAULT_PERMISSIONS)); return DEFAULT_PERMISSIONS; }\n  return JSON.parse(stored);\n}\nfunction savePermissions(p) { localStorage.setItem(KEYS.permissions, JSON.stringify(p)); }\nfunction hasPermission(role, view) {\n  const p = getPermissions();\n  return p[role]?.includes(view);\n}\n"
    with open("data.js", "wb") as f:
        f.write(new_content)
    print("Fixed data.js")
else:
    print("Marker not found")
