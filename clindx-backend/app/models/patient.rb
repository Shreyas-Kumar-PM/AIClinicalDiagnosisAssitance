class Patient < ApplicationRecord
  belongs_to :doctor

  has_many :evaluations, dependent: :destroy

  validates :name, presence: true
  validates :age, presence: true
end
