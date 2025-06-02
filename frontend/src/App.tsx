import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'jotai';
import { authenticate, isUserSignedIn, logUserOut, getUserData } from './services/auth';
import CreateVault from './components/CreateVault';
import VaultManage from './components/VaultManage';
import { networkAtom } from './store/atoms';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './styles/components.css';
import { FaLock, FaUserShield, FaCoins, FaBitcoin, FaShieldAlt, FaRegClock, FaUsers, FaBook, FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

// Component for showing heir claims page
const HeirClaims: React.FC = () => {
  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>My Heir Claims</h1>
        <p className="page-subtitle">View and manage assets that have been designated to you</p>
      </div>
      
      <div className="card empty-state">
        <div className="empty-icon">
          <FaUserShield />
        </div>
        <h3>No Pending Claims</h3>
        <p>You don't have any pending claims. Check back later or ask the vault owner to add you as an heir.</p>
      </div>
    </div>
  );
};

// Component for showing user's vaults
const MyVaults: React.FC = () => {
  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>My Vaults</h1>
        <p className="page-subtitle">Manage your time-locked Bitcoin and asset vaults</p>
      </div>
      
      <div className="card empty-state">
        <div className="empty-icon">
          <FaLock />
        </div>
        <h3>No Vaults Created Yet</h3>
        <p>You haven't created any vaults yet. Start securing your digital assets today.</p>
        <Link to="/create-vault" className="btn btn-primary btn-lg">Create Your First Vault</Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userSession, setUserSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isUserSignedIn()) {
      setUserSession(getUserData());
    }
    setLoading(false);
  }, []);

  const handleSignIn = () => {
    authenticate();
  };

  const handleSignOut = () => {
    logUserOut();
    setUserSession(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <FaLock className="loading-icon" />
        </div>
        <p>Loading TimeLock Vault...</p>
      </div>
    );
  }

  return (
    <Provider initialValues={[[networkAtom, 'testnet']]}>
      <Router>
        <div className="app-wrapper">
          {/* Header */}
          <header className="app-header">
            <div className="container header-container">
              <Link to="/" className="logo-wrapper">
                <div className="logo-icon">
                  <FaLock />
                </div>
                <div className="logo-text">TimeLock Vault</div>
              </Link>
              <div>
                {userSession ? (
                  <div className="user-menu">
                    <div className="user-address">
                      <FaUserShield className="address-icon" />
                      <span className="address-text">
                        {userSession.profile.stxAddress.mainnet.substring(0, 6)}...
                        {userSession.profile.stxAddress.mainnet.substring(userSession.profile.stxAddress.mainnet.length - 4)}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-outline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="btn btn-primary btn-icon"
                  >
                    <FaLock /> Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                userSession ? (
                  <div className="dashboard">
                    <div className="container">
                      <div className="welcome-banner">
                        <h1>Welcome to TimeLock Vault</h1>
                        <p>Your secure inheritance and asset release system on Bitcoin</p>
                      </div>
                      <div className="dashboard-actions">
                        <Link to="/create-vault" className="action-card">
                          <div className="action-icon">
                            <FaLock />
                          </div>
                          <h3>Create New Vault</h3>
                          <p>Setup a time-locked vault with inheritance rules</p>
                        </Link>
                        <Link to="/my-vaults" className="action-card">
                          <div className="action-icon">
                            <FaCoins />
                          </div>
                          <h3>Manage Vaults</h3>
                          <p>View and manage your existing vaults</p>
                        </Link>
                        <Link to="/heir-claims" className="action-card">
                          <div className="action-icon">
                            <FaUserShield />
                          </div>
                          <h3>Heir Claims</h3>
                          <p>Check for assets designated to you</p>
                        </Link>
                        <a href="https://docs.timevault.btc" target="_blank" rel="noopener noreferrer" className="action-card">
                          <div className="action-icon">
                            <FaBook />
                          </div>
                          <h3>Learn More</h3>
                          <p>Documentation and guides</p>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <section className="hero-section">
                      <div className="hero-bg"></div>
                      <div className="container">
                        <h1 className="hero-title">
                          Never Lose <span className="gradient-text">Your Bitcoin</span> Again
                        </h1>
                        <p className="hero-subtitle">
                          Decentralized inheritance and asset release system secured by the Bitcoin blockchain
                        </p>
                        <button
                          onClick={handleSignIn}
                          className="btn btn-gradient btn-lg"
                        >
                          Connect Wallet to Start
                        </button>
                      </div>
                    </section>
                    
                    <section className="feature-section">
                      <div className="container">
                        <div className="section-header">
                          <h2 className="section-title">Secure Your Digital Legacy</h2>
                          <p className="section-description">
                            Over $140 billion in Bitcoin has been lost forever due to forgotten keys or user deaths. 
                            TimeLock Vault provides a trustless solution to secure your digital assets for the future.
                          </p>
                        </div>
                        
                        <div className="feature-grid">
                          <div className="feature-card">
                            <div className="feature-icon">
                              <FaRegClock />
                            </div>
                            <h3 className="feature-title">Time-Locked Vaults</h3>
                            <p className="feature-description">
                              Set specific unlock times for your assets or enable "dead man's switch" functionality that activates after periods of inactivity.
                            </p>
                          </div>
                          
                          <div className="feature-card">
                            <div className="feature-icon">
                              <FaUsers />
                            </div>
                            <h3 className="feature-title">Multi-Heir Distribution</h3>
                            <p className="feature-description">
                              Designate multiple beneficiaries and assign specific percentages of your assets to each heir automatically.
                            </p>
                          </div>
                          
                          <div className="feature-card">
                            <div className="feature-icon">
                              <FaShieldAlt />
                            </div>
                            <h3 className="feature-title">Secure & Trustless</h3>
                            <p className="feature-description">
                              Fully decentralized and secured by the Bitcoin blockchain via Stacks - no central authority or intermediary.
                            </p>
                          </div>
                          
                          <div className="feature-card">
                            <div className="feature-icon">
                              <FaBitcoin />
                            </div>
                            <h3 className="feature-title">Bitcoin-Native</h3>
                            <p className="feature-description">
                              Built on Bitcoin's security using Clarity smart contracts - the most secure blockchain in the world.
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                    
                    <section className="cta-section">
                      <div className="cta-content">
                        <h2 className="cta-title">Ready to Secure Your Bitcoin?</h2>
                        <p className="cta-description">
                          Create your first TimeLock Vault in minutes and ensure your digital assets reach their intended destination.
                        </p>
                        <button onClick={handleSignIn} className="cta-button">
                          Connect Wallet
                        </button>
                      </div>
                    </section>
                  </>
                )
              } />
              <Route path="/create-vault" element={userSession ? <CreateVault /> : <Navigate to="/" />} />
              <Route path="/vault/:id" element={userSession ? <VaultManage /> : <Navigate to="/" />} />
              <Route path="/my-vaults" element={userSession ? <MyVaults /> : <Navigate to="/" />} />
              <Route path="/heir-claims" element={userSession ? <HeirClaims /> : <Navigate to="/" />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="app-footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-branding">
                  <div className="footer-logo">
                    <div className="logo-icon">
                      <FaLock />
                    </div>
                    <div className="logo-text">TimeLock Vault</div>
                  </div>
                  <p className="footer-description">
                    Bitcoin-secured inheritance and asset vault for your digital legacy
                  </p>
                </div>
                
                <div className="footer-links-section">
                  <h4 className="footer-heading">Product</h4>
                  <ul className="footer-links">
                    <li><a href="#">How it Works</a></li>
                    <li><a href="#">Security</a></li>
                    <li><a href="#">Fees</a></li>
                    <li><a href="#">FAQ</a></li>
                  </ul>
                </div>
                
                <div className="footer-links-section">
                  <h4 className="footer-heading">Resources</h4>
                  <ul className="footer-links">
                    <li><a href="#" className="footer-link"><FaBook className="link-icon" /> Documentation</a></li>
                    <li><a href="#" className="footer-link"><FaGithub className="link-icon" /> GitHub</a></li>
                  </ul>
                </div>
                
                <div className="footer-links-section">
                  <h4 className="footer-heading">Community</h4>
                  <ul className="footer-links">
                    <li><a href="#" className="footer-link"><FaTwitter className="link-icon" /> Twitter</a></li>
                    <li><a href="#" className="footer-link"><FaDiscord className="link-icon" /> Discord</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>
                  &copy; {new Date().getFullYear()} TimeLock Vault. All rights reserved. Built on Bitcoin.
                </p>
              </div>
            </div>
          </footer>
          
          {/* Toast notifications container */}
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
