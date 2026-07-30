from app.assessments.scoring import score_from_option, wellness_level_from_score


def test_score_from_option_valid():
    assert score_from_option("Never") == 0
    assert score_from_option("Rarely") == 1
    assert score_from_option("Sometimes") == 2
    assert score_from_option("Often") == 3
    assert score_from_option("Always") == 4


def test_score_from_option_invalid():
    try:
        score_from_option("Maybe")
        assert False, "expected ValueError for an unrecognized option"
    except ValueError:
        pass


def test_wellness_level_boundaries():
    assert wellness_level_from_score(0) == "Low Stress"
    assert wellness_level_from_score(7) == "Low Stress"
    assert wellness_level_from_score(8) == "Moderate Stress"
    assert wellness_level_from_score(15) == "Moderate Stress"
    assert wellness_level_from_score(16) == "High Stress"
    assert wellness_level_from_score(100) == "High Stress"