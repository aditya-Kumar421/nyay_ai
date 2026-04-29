import FormInput from './FormInput'

const locationOptions = [
  { value: 'New Delhi', label: 'New Delhi' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Chennai', label: 'Chennai' },
  { value: 'Kolkata', label: 'Kolkata' },
  { value: 'Prayagraj', label: 'Prayagraj' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Ahmedabad', label: 'Ahmedabad' },
  { value: 'Patna', label: 'Patna' },
  { value: 'Lucknow', label: 'Lucknow' },
  { value: 'Chandigarh', label: 'Chandigarh' },
  { value: 'Jaipur', label: 'Jaipur' },
  { value: 'Bhopal', label: 'Bhopal' },
  { value: 'Cuttack', label: 'Cuttack' },
  { value: 'Guwahati', label: 'Guwahati' },
  { value: 'Ranchi', label: 'Ranchi' },
  { value: 'Raipur', label: 'Raipur' },
  { value: 'Kochi', label: 'Kochi' },
  { value: 'Shimla', label: 'Shimla' },
  { value: 'Jodhpur', label: 'Jodhpur' }
]

export default function CaseForm({ form, onChange, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <FormInput
        label="Describe your legal issue"
        type="textarea"
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="e.g. Property dispute with neighbour over land boundary in Noida…"
        required
        rows={5}
        hint="Be as specific as possible to get the most relevant recommendations."
      />

      <div className="responsive-form-grid">
        <FormInput
          label="Budget (₹)"
          type="number"
          name="budget"
          value={form.budget}
          onChange={onChange}
          placeholder="5000"
          required
          min="0"
          hint="Your consultation budget in INR"
        />
        <FormInput
          label="Your Location"
          type="select"
          name="location"
          value={form.location}
          onChange={onChange}
          options={locationOptions}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
        style={{ width: '100%', marginTop: '4px' }}
      >
        {loading ? (
          <>
            <span className="spinner" />
            Finding lawyers…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Find Matching Lawyers
          </>
        )}
      </button>
    </form>
  )
}
