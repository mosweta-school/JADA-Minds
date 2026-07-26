from marshmallow import Schema, fields


class SpecialistSchema(Schema):
    """
    Public-facing specialist profile. Deliberately excludes
    national_id_url / degree_certificate_url / professional_license_url —
    those are private verification documents, not for a client-facing
    directory. Also excludes verification_status itself, since this
    endpoint only ever returns approved specialists anyway.
    """
    id = fields.Int(dump_only=True)
    specialization = fields.Str(dump_only=True)
    bio = fields.Str(dump_only=True)
    full_name = fields.Method("get_full_name", dump_only=True)

    def get_full_name(self, obj):
        return obj.user.full_name if obj.user else None


specialist_schema = SpecialistSchema()
specialists_schema = SpecialistSchema(many=True)