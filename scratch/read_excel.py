import openpyxl
import sys

try:
    file_path = "Lista de Materiais.xlsx"
    wb = openpyxl.load_workbook(file_path, data_only=True)
    sheet = wb.active
    
    for row in sheet.iter_rows(values_only=True):
        if any(row): # Skip empty rows
            print("|".join(str(cell) if cell is not None else "" for cell in row))
except Exception as e:
    print(f"Error: {e}")
