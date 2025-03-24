"""add name and surname to patient

Revision ID: b78d241f4f44
Revises: 
Create Date: 2025-03-24 17:47:06.302042

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'b78d241f4f44'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add columns as nullable first
    op.add_column('patient', sa.Column('name', sa.String(length=255), nullable=True))
    op.add_column('patient', sa.Column('surname', sa.String(length=255), nullable=True))

    # Update existing rows with default values
    op.execute("UPDATE patient SET name = 'Unknown', surname = 'Unknown' WHERE name IS NULL")

    # Make columns non-nullable
    op.alter_column('patient', 'name', nullable=False)
    op.alter_column('patient', 'surname', nullable=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('patient', 'surname')
    op.drop_column('patient', 'name')
