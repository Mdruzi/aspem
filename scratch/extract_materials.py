import openpyxl
import json

def clean_unit(u):
    if not u: return 'un'
    u = str(u).lower().strip()
    if any(x in u for x in ['p', 'pc', 'peça', 'un', 'und']): return 'un'
    if 'm' in u and '²' not in u: return 'm'
    if 'kg' in u: return 'kg'
    if 'cx' in u: return 'cx'
    if 'rol' in u: return 'rol'
    return 'un'

try:
    file_path = "Lista de Materiais.xlsx"
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active
    
    materials = []
    seen = set()
    categories = set()
    
    # Skip header rows
    for row in sheet.iter_rows(min_row=4, values_only=True):
        if len(row) < 6: continue
        
        name = str(row[2]).strip() if row[2] else ""
        category = str(row[4]).strip() if row[4] else "Geral"
        unit = clean_unit(row[5])
        
        if not name or name == "None": continue
        if category == "None": category = "Geral"
        
        # Avoid exact duplicates
        key = (category, name)
        if key in seen: continue
        seen.add(key)
        categories.add(category)
        
        materials.append({
            "category": category,
            "name": name,
            "defaultUnit": unit,
            "active": True
        })
    
    # Add "Outro" to each category
    for cat in sorted(categories):
        materials.append({
            "category": cat,
            "name": "Outro",
            "defaultUnit": "un",
            "active": True
        })
    
    # Sort by category and then name
    materials.sort(key=lambda x: (x['category'], x['name']))
    
    # Add IDs
    for i, m in enumerate(materials, 1):
        m['id'] = i
        
    print(json.dumps(materials, indent=2, ensure_ascii=False))
    
except Exception as e:
    print(f"Error: {e}")
