from marshmallow import Schema, fields, validate


class ResourceSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(dump_only=True)
    category = fields.Str(dump_only=True)
    description = fields.Str(dump_only=True)
    url = fields.Str(dump_only=True)
    is_active = fields.Bool(dump_only=True)


class ResourceInputSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    category = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str(required=True, validate=validate.Length(min=1))
    url = fields.Str(required=False, allow_none=True, validate=validate.URL())


class ResourceUpdateSchema(Schema):
    title = fields.Str(validate=validate.Length(min=1))
    category = fields.Str(validate=validate.Length(min=1))
    description = fields.Str(validate=validate.Length(min=1))
    url = fields.Str(allow_none=True, validate=validate.URL())


resource_schema = ResourceSchema()
resources_schema = ResourceSchema(many=True)
resource_input_schema = ResourceInputSchema()
resource_update_schema = ResourceUpdateSchema(partial=True)