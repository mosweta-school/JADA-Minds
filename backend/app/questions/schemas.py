from marshmallow import Schema, fields, validate


class QuestionSchema(Schema):
    id = fields.Int(dump_only=True)
    question_text = fields.Str(dump_only=True)
    category = fields.Str(dump_only=True)
    weight = fields.Int(dump_only=True)
    display_order = fields.Int(dump_only=True)
    is_active = fields.Bool(dump_only=True)


class QuestionInputSchema(Schema):
    question_text = fields.Str(required=True, validate=validate.Length(min=1))
    category = fields.Str(required=True, validate=validate.Length(min=1))
    weight = fields.Int(load_default=1, validate=validate.Range(min=1))
    display_order = fields.Int(required=True)


class QuestionUpdateSchema(Schema):
    question_text = fields.Str(validate=validate.Length(min=1))
    category = fields.Str(validate=validate.Length(min=1))
    weight = fields.Int(validate=validate.Range(min=1))
    display_order = fields.Int()


question_schema = QuestionSchema()
questions_schema = QuestionSchema(many=True)
question_input_schema = QuestionInputSchema()
question_update_schema = QuestionUpdateSchema(partial=True) 