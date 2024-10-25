import pandas as pd
from sklearn.linear_model import LinearRegression
import sys
import json

def generar_informe(ventas):
    # Convertir los datos de ventas a un DataFrame de Pandas
    df = pd.DataFrame(ventas)
    df['FechaVenta'] = pd.to_datetime(df['FechaVenta'])
    df['Mes'] = df['FechaVenta'].dt.month
    df['Año'] = df['FechaVenta'].dt.year

    # Preparar los datos para el modelo
    X = df[['Año', 'Mes']]
    y = df['Total']

    # Entrenar el modelo de regresión lineal
    modelo = LinearRegression()
    modelo.fit(X, y)

    # Predecir ventas para noviembre de 2024
    prediccion = modelo.predict([[2024, 11]])[0]

    # Generar un resumen del informe
    resumen = df.groupby(['Año', 'Mes'])['Total'].sum().reset_index()

    return {
        "resumen": resumen.to_dict(orient='records'),
        "prediccion": round(prediccion, 2)
    }

if __name__ == "__main__":
    # Leer los datos de ventas desde los argumentos del script
    ventas = json.loads(sys.argv[1])
    informe = generar_informe(ventas)
    print(json.dumps(informe))
