import azure.functions as func

from auth.endpoints import bp as auth_bp
from records.endpoints import bp as records_bp

app = func.FunctionApp()

app.register_functions(auth_bp)
app.register_functions(records_bp)