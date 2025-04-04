"""Fixed FamilyRelation self-referential relationship

Revision ID: ccf66623b0e5
Revises: 7e09950ea8fb
Create Date: 2025-04-02 17:55:18.505358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ccf66623b0e5'
down_revision: Union[str, None] = '7e09950ea8fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('calendar')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('calendar',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('event_type', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('date_from', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('date_to', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('state', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('doctor_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['doctor_id'], ['doctor.id'], name='calendar_doctor_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='calendar_pkey')
    )
    # ### end Alembic commands ###
