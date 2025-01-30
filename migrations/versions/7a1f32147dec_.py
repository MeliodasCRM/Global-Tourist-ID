"""empty message

Revision ID: 7a1f32147dec
Revises: 6fb5a0097187
Create Date: 2025-01-30 18:32:40.743688

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7a1f32147dec'
down_revision = '6fb5a0097187'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('contact', schema=None) as batch_op:
        batch_op.drop_constraint('contact_group_id_fkey', type_='foreignkey')
        batch_op.drop_column('group_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('contact', schema=None) as batch_op:
        batch_op.add_column(sa.Column('group_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('contact_group_id_fkey', 'group', ['group_id'], ['id'])

    # ### end Alembic commands ###
