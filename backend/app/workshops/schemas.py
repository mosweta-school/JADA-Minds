from marshmallow import Schema, fields, validate


class WorkshopSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    event_date = fields.Date(dump_only=True)
    location = fields.Str(dump_only=True)
    capacity = fields.Int(dump_only=True)


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
registration_input_schema = RegistrationInputSchema()
registration_schema = RegistrationOutSchema()
registrations_schema = RegistrationOutSchema(many=True)