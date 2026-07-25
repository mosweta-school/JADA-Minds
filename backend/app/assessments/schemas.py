from marshmallow import Schema, fields, validate

from .scoring import LIKERT_SCORES


class ResponseInputSchema(Schema):
    question_id = fields.Int(required=True)
    selected_option = fields.Str(
        required=True,
        validate=validate.OneOf(list(LIKERT_SCORES.keys()))
    )


class AssessmentInputSchema(Schema):
    responses = fields.List(
        fields.Nested(ResponseInputSchema),
        required=True,
        validate=validate.Length(min=1)
    )


class AssessmentResponseOutSchema(Schema):
    question_id = fields.Int()
    selected_option = fields.Str()
    score = fields.Int()


class AssessmentOutSchema(Schema):
    id = fields.Int()
    user_id = fields.Int()
    total_score = fields.Int()
    wellness_level = fields.Str()
    created_at = fields.DateTime()
    responses = fields.List(fields.Nested(AssessmentResponseOutSchema))


assessment_input_schema = AssessmentInputSchema()
assessment_out_schema = AssessmentOutSchema()