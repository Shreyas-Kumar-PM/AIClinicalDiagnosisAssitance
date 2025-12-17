class CreateEvaluations < ActiveRecord::Migration[8.1]
  def change
    create_table :evaluations do |t|
      t.references :patient, null: false, foreign_key: true
      t.text :symptoms
      t.jsonb :vitals
      t.jsonb :labs
      t.jsonb :diagnosis

      t.timestamps
    end
  end
end
