import json
from datetime import datetime, timezone


def build_response(status_code, body):
    """Return the structure API Gateway (HTTP API) expects from Lambda."""
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }


def classify_entry(text):
    """Very simple rule: is this a plan for today or a look back?"""
    lowered = text.lower()
    reflection_words = ["today i", "yesterday", "i felt", "i learned", "i noticed", "went well", "i realised", "i realized"]
    focus_words = ["i want to", "i will", "my focus", "i plan", "i need to", "goal", "today, i"]

    if any(word in lowered for word in reflection_words):
        return "Reflection"
    if any(word in lowered for word in focus_words):
        return "Focus"
    return "Note"


def lambda_handler(event, context):
    # The browser sends JSON as a string inside event["body"]
    try:
        raw_body = event.get("body") or "{}"
        payload = json.loads(raw_body)
    except (json.JSONDecodeError, TypeError):
        return build_response(400, {"error": "Request body must be valid JSON."})

    text = str(payload.get("reflection", "")).strip()

    if not text:
        return build_response(400, {"error": "Please provide a reflection or focus."})

    if len(text) > 1000:
        return build_response(400, {"error": "Entry is too long. Keep it under 1000 characters."})

    word_count = len(text.split())
    entry_type = classify_entry(text)

    if entry_type == "Focus":
        message = "A clear intention is already half the work. Protect the first hour of your day for it."
    elif entry_type == "Reflection":
        message = "Noticing what happened is how progress becomes lasting. Carry one lesson into tomorrow."
    else:
        message = "Thank you for putting your thoughts into words. Name one small action to take next."

    return build_response(200, {
        "message": message,
        "entryType": entry_type,
        "wordCount": word_count,
        "receivedAt": datetime.now(timezone.utc).isoformat(),
    })