import { useState } from "react";
import { Inbox, Send, Star, Trash2, FileText } from "lucide-react";

const MOCK_EMAILS = [
  { id: 1, from: "AuraOS Team", subject: "Welcome to AuraOS!", preview: "Thank you for joining the AuraOS ecosystem. Your desktop environment is ready.", time: "10:30 AM", unread: true },
  { id: 2, from: "System Update", subject: "AuraOS v1.0.1 Available", preview: "A new update is available for your system. This includes performance improvements...", time: "9:15 AM", unread: true },
  { id: 3, from: "Security Alert", subject: "Login from new device", preview: "We detected a login from a new device. If this was you, no action is needed.", time: "Yesterday", unread: false },
  { id: 4, from: "AuraOS Newsletter", subject: "What's New in Aura Effects", preview: "Discover the latest aura effect presets and color schemes for your workspace.", time: "2 days ago", unread: false },
  { id: 5, from: "Dev Community", subject: "Build apps for AuraOS", preview: "Learn how to create native applications for the AuraOS platform using our SDK.", time: "3 days ago", unread: false },
];

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 2 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "starred", label: "Starred", icon: Star, count: 0 },
  { id: "drafts", label: "Drafts", icon: FileText, count: 0 },
  { id: "trash", label: "Trash", icon: Trash2, count: 0 },
];

export default function EmailApp() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);

  return (
    <div className="email-layout" data-testid="email-app">
      <div className="email-sidebar">
        {FOLDERS.map(folder => {
          const Icon = folder.icon;
          return (
            <div
              key={folder.id}
              className={`email-folder ${activeFolder === folder.id ? "active" : ""}`}
              onClick={() => { setActiveFolder(folder.id); setSelectedEmail(null); }}
              data-testid={`email-folder-${folder.id}`}
            >
              <Icon size={15} />
              <span style={{ flex: 1 }}>{folder.label}</span>
              {folder.count > 0 && (
                <span style={{
                  fontSize: 10, background: 'rgba(100,180,238,0.2)', color: '#6CB4EE',
                  padding: '1px 6px', borderRadius: 10, fontWeight: 600
                }}>
                  {folder.count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="email-list" data-testid="email-list">
        {selectedEmail ? (
          <div style={{ padding: 16 }} data-testid="email-detail">
            <div
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginBottom: 16 }}
              onClick={() => setSelectedEmail(null)}
            >
              &larr; Back to Inbox
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
              {selectedEmail.subject}
            </h3>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
              From: {selectedEmail.from}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
              {selectedEmail.time}
            </div>
            <div style={{
              fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)',
              padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.04)'
            }}>
              {selectedEmail.preview}
            </div>
          </div>
        ) : (
          activeFolder === "inbox" ? MOCK_EMAILS.map(email => (
            <div
              key={email.id}
              className="email-item"
              onClick={() => setSelectedEmail(email)}
              data-testid={`email-item-${email.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="email-item-from" style={{ fontWeight: email.unread ? 600 : 400 }}>
                  {email.unread && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#6CB4EE', marginRight: 8 }} />}
                  {email.from}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{email.time}</span>
              </div>
              <div className="email-item-subject">{email.subject}</div>
              <div className="email-item-preview">{email.preview}</div>
            </div>
          )) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
              No emails in {activeFolder}
            </div>
          )
        )}
      </div>
    </div>
  );
}
