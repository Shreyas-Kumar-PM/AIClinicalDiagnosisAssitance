class CreateDoctors < ActiveRecord::Migration[8.1]
  def change
    create_table :doctors do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.string :specialization

      t.timestamps
    end
  end
end
