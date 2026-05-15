"""Ejemplo de uso de `load_data()`.

Uso:
    python backend/examples/load_data_example.py [DATA_DIR]

Si no se proporciona `DATA_DIR`, `load_data()` usará la ruta por defecto (`backend/data`).
"""
from backend.app.data_loader import load_data
import sys


def main():
    data_dir = sys.argv[1] if len(sys.argv) > 1 else None
    ratings, items = load_data(data_dir=data_dir)
    print(f"Usuarios cargados: {len(ratings)}")
    print(f"Películas en metadatos: {len(items)}")


if __name__ == '__main__':
    main()
