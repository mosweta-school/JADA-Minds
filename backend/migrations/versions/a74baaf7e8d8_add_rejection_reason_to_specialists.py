"""add rejection reason to specialists

Revision ID: a74baaf7e8d8
Revises: aed674b05711
Create Date: 2026-07-30 20:57:40.682050

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a74baaf7e8d8'
down_revision = 'aed674b05711'
branch_labels = None
depends_on = None



def upgrade():
    op.add_column(
        'specialists',
        sa.Column('rejection_reason', sa.Text(), nullable=True)
    )


def downgrade():
    op.drop_column('specialists', 'rejection_reason')