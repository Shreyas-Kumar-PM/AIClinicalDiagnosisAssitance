class CreateAuditLogs < ActiveRecord::Migration[8.1]
  def change
    create_table :audit_logs do |t|
      t.references :doctor, null: false, foreign_key: true
      t.string :action
      t.string :auditable_type
      t.integer :auditable_id
      t.jsonb :metadata

      t.timestamps
    end
  end
end
