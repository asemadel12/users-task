from fastapi import FastAPI


app = FastAPI(title="MAKE WORK FLOW Users API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
