class FixEvaluationsForeignKey < ActiveRecord::Migration[8.1]
  def change
    # Remove old FK
    remove_foreign_key :evaluations, :patients

    # Add CASCADE FK
    add_foreign_key :evaluations, :patients, on_delete: :cascade
  end
end
