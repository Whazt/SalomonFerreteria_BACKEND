import pandas as pd
from sklearn.linear_model import LinearRegression
from sqlalchemy import create_engine
import requests
import json

# Datos de conexión a MySQL en Clever Cloud
usuario = "uzgmw1xij5tld93a"
password = "I2Ca583D6t2HZjJJwOxZ"
host = "bzevlkm3xyje5fxw6drv-mysql.services.clever-cloud.com"
base_datos = "bzevlkm3xyje5fxw6drv"

# Crear el motor de conexión usando SQLAlchemy
def obtener_conexion():
    return create_engine(f"mysql+pymysql://{usuario}:{password}@{host}/{base_datos}")

# Generar informe de ventas con predicción
def generar_informe_ventas():
    engine = obtener_conexion()
    query_ventas = "SELECT FechaVenta, Total FROM Ventas"
    df_ventas = pd.read_sql(query_ventas, engine)

    # Convertir FechaVenta a datetime y extraer año y mes
    df_ventas['FechaVenta'] = pd.to_datetime(df_ventas['FechaVenta'])
    df_ventas['Mes'] = df_ventas['FechaVenta'].dt.month
    df_ventas['Año'] = df_ventas['FechaVenta'].dt.year

    # Entrenar modelo
    X = df_ventas[['Año', 'Mes']]
    y = df_ventas['Total']
    modelo = LinearRegression()
    modelo.fit(X, y)

    # Crear DataFrame para la predicción del próximo mes
    df_prediccion = pd.DataFrame({'Año': [2024], 'Mes': [11]})
    prediccion = modelo.predict(df_prediccion)[0]

    # Formato del informe
    informe = {
        "año": 2024,
        "mes": 11,
        "prediccion": round(prediccion, 2)
    }

    # Ahora, si necesitas incluir información sobre productos vendidos
    query_detalle_ventas = "SELECT CodProd, cantv FROM Det_Ventas"
    df_detalle_ventas = pd.read_sql(query_detalle_ventas, engine)

    query_productos = "SELECT CodProd, NombreProd FROM Productos"
    df_productos = pd.read_sql(query_productos, engine)

    # Asegúrate de que ambas columnas tengan el mismo tipo de datos
    df_detalle_ventas['CodProd'] = df_detalle_ventas['CodProd'].astype(int)
    df_productos['CodProd'] = df_productos['CodProd'].astype(int)

    # Hacer la unión de los DataFrames
    df_productos_vendidos = df_detalle_ventas.merge(df_productos, on='CodProd', how='left')

    # Mostrar el informe completo en formato JSON
    informe_completo = {
        "informe": informe,
        "detalles_productos_vendidos": df_productos_vendidos.to_dict(orient='records')
    }

    return informe_completo

# Ejecutar el script
if __name__ == '__main__':
    informe = generar_informe_ventas()
    print(json.dumps(informe, indent=2))  # Usa indent para una salida más legible
