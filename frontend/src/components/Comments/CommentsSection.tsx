import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  termId: string;
  author: string;
  text: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentsSectionProps {
  termId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ termId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termId]);

  const loadComments = () => {
    const saved = localStorage.getItem(`comments-${termId}`);
    if (saved) {
      setComments(JSON.parse(saved));
    }
  };

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    localStorage.setItem(`comments-${termId}`, JSON.stringify(updatedComments));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      termId,
      author: 'Current User', // In real app, get from auth
      text: newComment,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    saveComments([...comments, comment]);
    setNewComment('');
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        const reply: Comment = {
          id: `reply-${Date.now()}`,
          termId,
          author: 'Current User',
          text: replyText,
          createdAt: new Date().toISOString(),
        };
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      return comment;
    });

    saveComments(updatedComments);
    setReplyText('');
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-brand-dark mb-4">Comments & Discussions</h2>

      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment or ask a question..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Post Comment
        </button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-brand-dark">{comment.author}</span>
                  <span className="text-sm text-gray-500 ml-2">{formatDate(comment.createdAt)}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{comment.text}</p>
              
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-sm text-brand-primary hover:text-brand-dark"
              >
                {replyingTo === comment.id ? 'Cancel' : 'Reply'}
              </button>

              {replyingTo === comment.id && (
                <div className="mt-3 pl-4 border-l-2 border-brand-pastel">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="mt-2 px-3 py-1 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                  >
                    Post Reply
                  </button>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-brand-pastel space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-brand-light rounded p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-brand-dark">{reply.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

