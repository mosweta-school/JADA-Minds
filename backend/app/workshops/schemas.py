from marshmallow import Schema, fields, validate


class WorkshopSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    event_date = fields.Date(dump_only=True)
    location = fields.Str(dump_only=True)
    capacity = fields.Int(dump_only=True)
    is_active = fields.Bool(dump_only=True)


class WorkshopInputSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str(required=True, validate=validate.Length(min=1))
    event_date = fields.Date(required=True)
    location = fields.Str(required=True, validate=validate.Length(min=1))
    capacity = fields.Int(required=True, validate=validate.Range(min=1))


class WorkshopUpdateSchema(Schema):
    title = fields.Str(validate=validate.Length(min=1))
    description = fields.Str(validate=validate.Length(min=1))
    event_date = fields.Date()
    location = fields.Str(validate=validate.Length(min=1))
    capacity = fields.Int(validate=validate.Range(min=1))


class RegistrationInputSchema(Schema):
    workshop_id = fields.Int(required=True, validate=validate.Range(min=1))


class RegistrationOutSchema(Schema):
    id = fields.Int(dump_only=True)
    workshop_id = fields.Int(dump_only=True)
    status = fields.Str(dump_only=True)
    registered_at = fields.DateTime(dump_only=True)
    workshop = fields.Nested(WorkshopSchema, dump_only=True)


workshop_schema = WorkshopSchema()
workshops_schema = WorkshopSchema(many=True)
workshop_input_schema = WorkshopInputSchema()
workshop_update_schema = WorkshopUpdateSchema(partial=True)
registration_input_schema = RegistrationInputSchema()
registration_schema = RegistrationOutSchema()
registrations_schema = RegistrationOutSchema(many=True)