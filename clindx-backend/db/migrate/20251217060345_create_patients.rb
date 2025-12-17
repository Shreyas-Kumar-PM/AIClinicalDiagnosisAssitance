class CreatePatients < ActiveRecord::Migration[8.1]
  def change
    create_table :patients do |t|
      t.string :name
      t.integer :age
      t.string :gender
      t.references :doctor, null: false, foreign_key: true

      t.timestamps
    end
  end
end
