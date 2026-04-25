import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="font-display text-5xl text-coffee-dark tracking-tight leading-none mb-1">tala</span>
            <span className="text-[10px] text-coffee-medium uppercase tracking-[0.2em] ml-0.5">coffee shop</span>
          </div>
          <h1 className="text-xl font-medium text-coffee-dark">Connexion à l'espace équipe</h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="form-group">
            <label className="label">Adresse Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tala.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Mot de passe</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-coffee-medium">
          <p>Comptes de test par défaut :</p>
          <p>Admin: admin@tala.com | Mdp: password123</p>
          <p>Employé: emp1@tala.com | Mdp: password123</p>
        </div>
      </div>
    </div>
  );
}
