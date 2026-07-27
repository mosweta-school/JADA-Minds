"""
Scoring rules for the wellness questionnaire.

"""

LIKERT_SCORES = {
    "Never": 0,
    "Rarely": 1,
    "Sometimes": 2,
    "Often": 3,
    "Always": 4,
}

# Provisional MVP thresholds (assumes ~7 questions, scored 0-4 each).

WELLNESS_THRESHOLDS = [
    (7, "Low Stress"),
    (15, "Moderate Stress"),
    (21, "High Stress"),
]


def score_from_option(selected_option: str) -> int:
    try:
        return LIKERT_SCORES[selected_option]
    except KeyError:
        raise ValueError(f"Invalid option: {selected_option!r}")


def wellness_level_from_score(total_score: int) -> str:
    for upper_bound, label in WELLNESS_THRESHOLDS:
        if total_score <= upper_bound:
            return label
    return WELLNESS_THRESHOLDS[-1][1]