# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_18_114958) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "audit_logs", force: :cascade do |t|
    t.string "action"
    t.integer "auditable_id"
    t.string "auditable_type"
    t.datetime "created_at", null: false
    t.bigint "doctor_id", null: false
    t.jsonb "metadata"
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_audit_logs_on_doctor_id"
  end

  create_table "doctors", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "password_digest"
    t.string "specialization"
    t.datetime "updated_at", null: false
  end

  create_table "evaluations", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.jsonb "diagnosis"
    t.jsonb "labs"
    t.bigint "patient_id", null: false
    t.text "symptoms"
    t.datetime "updated_at", null: false
    t.jsonb "vitals"
    t.index ["patient_id"], name: "index_evaluations_on_patient_id"
  end

  create_table "patients", force: :cascade do |t|
    t.integer "age"
    t.datetime "created_at", null: false
    t.bigint "doctor_id", null: false
    t.string "gender"
    t.string "name"
    t.datetime "updated_at", null: false
    t.index ["doctor_id"], name: "index_patients_on_doctor_id"
  end

  add_foreign_key "audit_logs", "doctors"
  add_foreign_key "evaluations", "patients", on_delete: :cascade
  add_foreign_key "patients", "doctors"
end
