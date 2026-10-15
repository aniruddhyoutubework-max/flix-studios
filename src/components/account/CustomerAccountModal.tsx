import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/db';
import { Ticket, TicketMessage, PurchaseRecord, Review, Product } from '../../types/database';
import {
  X,
  User,
  Ticket as TicketIcon,
  Star,
  LogOut,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHireUs?: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenHireUs,
}) => {
  const { user, logout, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'tickets' | 'reviews' | 'purchases' | 'profile'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Purchases & Reviews
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Review submission state
  const [selectedProductForReview, setSelectedProductForReview] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewContent, setReviewContent] = useState<string>('');
  const [reviewContext, setReviewContext] = useState<string>('');
  const [reviewImageUrl, setReviewImageUrl] = useState<string>('');
  const [reviewError, setReviewError] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [imageUploadError, setImageUploadError] = useState<string>('');

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageUploadError('Invalid format. Please upload a PNG, JPEG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError('File is too large. Maximum image size is 5MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const publicUrl = await db.uploadReviewImage(file);
      setReviewImageUrl(publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setImageUploadError(msg);
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadCustomerData();
  }, [user, isOpen]);

  const loadCustomerData = async () => {
    if (!user) return;
    const userTickets = await db.getTickets(user.id);
    setTickets(userTickets);
    if (selectedTicket) {
      const refreshed = userTickets.find((t) => t.id === selectedTicket.id);
      if (refreshed) setSelectedTicket(refreshed);
    }

    const allPurchases = await db.getPurchases();
    const userPurchases = allPurchases.filter(
      (p) => p.customer_email.toLowerCase() === user.email.toLowerCase()
    );
    setPurchases(userPurchases);

    const allReviews = await db.getReviews();
    const userReviews = allReviews.filter((r) => r.customer_email.toLowerCase() === user.email.toLowerCase());
    setReviews(userReviews);

    const allProducts = await db.getProducts();
    setProducts(allProducts);

    // Auto-select first verified product if available
    const eligiblePurchase = userPurchases.find((p) => p.review_permitted && p.verification_status === 'verified');
    if (eligiblePurchase) {
      setSelectedProductForReview(eligiblePurchase.product_id);
    }
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-[115] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0D0E12] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-4">
          <User className="w-10 h-10 text-white/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">Customer Sign In Required</h3>
          <p className="text-xs text-white/50">
            Sign in to access your custom plugin projects, ticket threads, and verified review permissions.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-xs font-mono rounded-xl bg-white/5 hover:bg-white/10 text-white/70"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                openAuthModal('login');
              }}
              className="flex-1 py-2 text-xs font-mono rounded-xl bg-[#D7FF3F] hover:bg-[#c2eb2f] text-black font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    setIsSendingReply(true);

    try {
      await db.addTicketMessage(selectedTicket.id, {
        sender_id: user.id,
        sender_email: user.email,
        sender_role: 'customer',
        message: replyText,
      });

      setReplyText('');
      await loadCustomerData();
    } catch (err) {
      console.warn('Failed to post reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setIsSubmittingReview(true);

    const product = products.find((p) => p.id === selectedProductForReview);
    if (!product) {
      setReviewError('Selected product not found.');
      setIsSubmittingReview(false);
      return;
    }

    try {
      const res = await db.submitReview({
        product_id: product.id,
        product_name: product.name,
        customer_id: user.id,
        customer_name: user.full_name || user.email.split('@')[0],
        customer_email: user.email,
        rating: reviewRating,
        title: reviewTitle,
        content: reviewContent,
        usage_context: reviewContext,
        images: reviewImageUrl ? [reviewImageUrl] : [],
      });

      if (!res.success) {
        setReviewError(res.error || 'Failed to submit review.');
      } else {
        setReviewSuccess(
          'Your review has been submitted for studio moderation. Once approved, it will be published to the public showcase.'
        );
        setReviewTitle('');
        setReviewContent('');
        setReviewContext('');
        setReviewImageUrl('');
        await loadCustomerData();
      }
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : 'Unexpected review error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[115] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0D0E12] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 md:px-6 border-b border-white/10 flex items-center justify-between bg-[#111216]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D7FF3F]/10 border border-[#D7FF3F]/30 text-[#D7FF3F] flex items-center justify-center font-bold text-sm">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {user.full_name || user.email.split('@')[0]}
                {user.role === 'admin' ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8B5CFF]/20 text-[#8B5CFF]">
                    ADMINISTRATOR
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/60">
                    CLIENT
                  </span>
                )}
              </h3>
              <p className="text-[11px] font-mono text-white/40">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              title="Log Out"
              className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-black/40 border-b border-white/5 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('tickets');
              setSelectedTicket(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <TicketIcon className="w-3.5 h-3.5 text-[#D7FF3F]" />
            <span>My Tickets ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Product Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 ${
              activeTab === 'purchases'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CFF]" />
            <span>Verified Purchases ({purchases.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
          {activeTab === 'tickets' && (
            <div>
              {selectedTicket ? (
                /* Ticket Thread View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="text-xs font-mono text-white/50 hover:text-white flex items-center gap-1.5"
                    >
                      ← Back to Tickets List
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/40">
                        REF: {selectedTicket.ticket_number}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          selectedTicket.status === 'open'
                            ? 'bg-amber-400/20 text-amber-400'
                            : selectedTicket.status === 'in_progress'
                            ? 'bg-blue-400/20 text-blue-400'
                            : selectedTicket.status === 'resolved'
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>

                  {/* Initial Ticket Details Box */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <h4 className="text-sm font-bold text-white">{selectedTicket.title}</h4>
                    <p className="text-xs text-white/70 whitespace-pre-wrap leading-relaxed">
                      {selectedTicket.description}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-mono text-white/40 border-t border-white/5">
                      <span>Category: {selectedTicket.category}</span>
                      {selectedTicket.mc_version && <span>MC: {selectedTicket.mc_version}</span>}
                      {selectedTicket.budget_range && <span>Budget: {selectedTicket.budget_range}</span>}
                      {selectedTicket.timeframe && <span>Timeframe: {selectedTicket.timeframe}</span>}
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Studio Communications</span>
                    </h5>

                    {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                      selectedTicket.messages
                        .filter((m) => !m.is_internal_note) // Customers cannot see internal staff notes
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3.5 rounded-xl border text-xs max-w-[85%] ${
                              msg.sender_role === 'admin'
                                ? 'bg-[#8B5CFF]/10 border-[#8B5CFF]/30 ml-auto text-white'
                                : 'bg-[#14151B] border-white/10 mr-auto text-white/80'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-white/40 mb-1">
                              <span className="font-bold text-[#D7FF3F]">
                                {msg.sender_role === 'admin' ? '⚡ Flix Studios Staff' : 'You (Customer)'}
                              </span>
                              <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-white/40 italic py-2">
                        No messages yet. Our team has received your ticket and will update this thread.
                      </p>
                    )}
                  </div>

                  {/* Reply Input Box */}
                  <form onSubmit={handleSendReply} className="pt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type reply or additional specification..."
                      className="flex-1 bg-[#14151B] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                    />
                    <button
                      type="submit"
                      disabled={isSendingReply || !replyText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#c2eb2f] text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* Tickets List View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Your Development & Support Tickets</h4>
                      <p className="text-xs text-white/50">
                        Track progress, view engineer responses, and review technical deliverables.
                      </p>
                    </div>
                    {onOpenHireUs && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenHireUs();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#D7FF3F] text-black font-bold font-mono text-xs hover:bg-[#c2eb2f] transition-colors"
                      >
                        + New Project Brief
                      </button>
                    )}
                  </div>

                  {tickets.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-white/10 text-center space-y-3">
                      <FileText className="w-8 h-8 text-white/30 mx-auto" />
                      <p className="text-xs text-white/50">You have no active project inquiries or tickets.</p>
                      {onOpenHireUs && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenHireUs();
                          }}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#D7FF3F] inline-block"
                        >
                          Submit a Custom Plugin Inquiry
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTicket(t)}
                          className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#D7FF3F]">{t.ticket_number}</span>
                              <span className="text-xs font-semibold text-white">{t.title}</span>
                            </div>
                            <div className="text-[11px] text-white/40 font-mono">
                              {t.category} • Created {new Date(t.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                                t.status === 'open'
                                  ? 'bg-amber-400/20 text-amber-400'
                                  : t.status === 'in_progress'
                                  ? 'bg-blue-400/20 text-blue-400'
                                  : t.status === 'resolved'
                                  ? 'bg-green-400/20 text-green-400'
                                  : 'bg-white/10 text-white/60'
                              }`}
                            >
                              {t.status}
                            </span>
                            <span className="text-white/40 text-xs">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white">Paid-Purchaser Review Portal</h4>
                <p className="text-xs text-white/50">
                  Reviews are strictly reserved for verified customers authorized by Flix Studios.
                </p>
              </div>

              {/* Review Eligibility Box */}
              {purchases.filter((p) => p.review_permitted && p.verification_status === 'verified').length ===
              0 ? (
                <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>No Verified Purchase Permission Active</span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    If you purchased a Flix Studios resource or custom development through BuiltByBit or direct invoice,
                    our staff verifies purchase notifications manually and assigns review permissions to
                    your registered email ({user.email}).
                  </p>
                </div>
              ) : (
                /* Eligible Review Submission Form */
                <form onSubmit={handleSubmitReview} className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#D7FF3F] font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Review Authorization Confirmed</span>
                    </span>
                  </div>

                  {reviewError && (
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">VERIFIED PRODUCT</label>
                      <select
                        value={selectedProductForReview}
                        onChange={(e) => setSelectedProductForReview(e.target.value)}
                        className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D7FF3F]"
                      >
                        {purchases
                          .filter((p) => p.review_permitted && p.verification_status === 'verified')
                          .map((p) => (
                            <option key={p.product_id} value={p.product_id}>
                              {p.product_name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">RATING</label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className={`p-1 transition-colors ${
                              star <= reviewRating ? 'text-amber-400' : 'text-white/20'
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">REVIEW HEADLINE</label>
                    <input
                      type="text"
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Flawless 1.21.4 performance, async match history is incredible"
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">REVIEW CONTENT</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Share your experience running this plugin on your server, tick performance, reliability, and support..."
                      className="w-full bg-[#14151B] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">
                        SERVER ENVIRONMENT CONTEXT (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        value={reviewContext}
                        onChange={(e) => setReviewContext(e.target.value)}
                        placeholder="e.g. 150 player peak, Purpur 1.21.4, Redis Limbo"
                        className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-white/70 mb-1">
                        ATTACH SCREENSHOT / BENCHMARK PROOF (OPTIONAL)
                      </label>
                      {reviewImageUrl ? (
                        <div className="relative p-2 rounded-xl bg-[#14151B] border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={reviewImageUrl}
                              alt="Proof preview"
                              className="w-10 h-10 object-cover rounded-lg border border-white/10"
                            />
                            <span className="text-[11px] font-mono text-white/70 truncate">{reviewImageUrl}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setReviewImageUrl('')}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-mono shrink-0 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 cursor-pointer transition-colors text-xs text-white/70">
                            <Upload className="w-4 h-4 text-[#D7FF3F]" />
                            <span>
                              {isUploadingImage ? 'Uploading image...' : 'Upload Image (PNG, JPG, WebP - max 5MB)'}
                            </span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              disabled={isUploadingImage}
                              onChange={handleImageFileUpload}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="text"
                            value={reviewImageUrl}
                            onChange={(e) => setReviewImageUrl(e.target.value)}
                            placeholder="Or paste direct image URL (https://...)"
                            className="w-full bg-[#14151B] border border-white/10 rounded-xl px-3 py-1.5 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-[#D7FF3F]"
                          />
                        </div>
                      )}
                      {imageUploadError && (
                        <p className="text-[11px] text-red-400 font-mono mt-1">{imageUploadError}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#c2eb2f] text-black font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Verified Review'}
                  </button>
                </form>
              )}

              {/* User's Previous Reviews */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-mono text-white/50 uppercase tracking-wider">
                  Your Submitted Reviews
                </h5>
                {reviews.length === 0 ? (
                  <p className="text-xs text-white/40 italic">You have not submitted any reviews yet.</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{r.title}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            r.status === 'approved' || r.status === 'featured'
                              ? 'bg-green-500/20 text-green-400'
                              : r.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-400/20 text-amber-400'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/70">{r.content}</p>
                      <div className="text-[10px] font-mono text-white/40">
                        {r.product_name} • {r.rating} / 5 Stars • {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Verified Purchase Records</h4>
                <p className="text-xs text-white/50">
                  Products registered and verified under {user.email}.
                </p>
              </div>

              {purchases.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-xs text-white/40 space-y-2">
                  <ShieldCheck className="w-8 h-8 text-white/20 mx-auto" />
                  <p>No verified purchases currently linked to this email.</p>
                  <p className="text-[11px] text-white/30">
                    If you purchased via BuiltByBit, notify staff or create a ticket with your transaction ID.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {purchases.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{p.product_name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#D7FF3F]/20 text-[#D7FF3F] text-[10px] font-mono">
                            VERIFIED
                          </span>
                        </div>
                        <div className="text-[11px] text-white/40 font-mono">
                          Review Access: {p.review_permitted ? 'Granted' : 'Revoked'} • Verified:{' '}
                          {new Date(p.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {p.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
