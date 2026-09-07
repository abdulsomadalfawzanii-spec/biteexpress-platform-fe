import { LoaderCircle, SearchX } from 'lucide-react';

export const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="page-header flex flex-col md:flex-row md:items-end md:justify-between gap-5">
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
    {action}
  </div>
);

export const MetricCard = ({ label, value, detail, icon: Icon, tone = 'orange' }) => (
  <article className="metric-card">
    <div className={`metric-icon metric-icon-${tone}`}><Icon className="w-5 h-5" /></div>
    <p className="metric-label">{label}</p>
    <p className="metric-value">{value}</p>
    {detail && <p className="metric-detail">{detail}</p>}
  </article>
);

export const StatusBadge = ({ children, tone = 'neutral' }) => <span className={`status-badge status-${tone}`}>{children}</span>;

export const EmptyState = ({ title, description, action, icon: Icon = SearchX }) => (
  <div className="empty-state">
    <div className="empty-state-icon"><Icon className="w-6 h-6" /></div>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    {action}
  </div>
);

export const LoadingState = ({ label = 'Loading your experience...' }) => (
  <div className="loading-state"><LoaderCircle className="w-6 h-6 animate-spin text-orange-500" /><span>{label}</span></div>
);
