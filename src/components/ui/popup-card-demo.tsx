import { useState } from 'react';
import { PopupCard, usePopupCard } from './popup-card';
import { Button } from './button';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export function PopupCardDemo() {
  const basicPopup = usePopupCard();
  const scrollablePopup = usePopupCard();
  const formPopup = usePopupCard();
  const confirmPopup = usePopupCard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formPopup.close();
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-6">Pop-up Card Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={basicPopup.open}>
          Open Basic Pop-up
        </Button>

        <Button onClick={scrollablePopup.open} variant="secondary">
          Open Scrollable Pop-up
        </Button>

        <Button onClick={formPopup.open} variant="outline">
          Open Form Pop-up
        </Button>

        <Button onClick={confirmPopup.open} variant="destructive">
          Open Confirmation Pop-up
        </Button>
      </div>

      <PopupCard
        isOpen={basicPopup.isOpen}
        onClose={basicPopup.close}
        title="Welcome"
        maxWidth="500px"
        aria-label="Welcome message"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Basic Pop-up Card</h3>
              <p className="text-slate-600">
                This is a simple pop-up card with a title, content, and close button.
                You can click the X button, press Escape, or click outside to close it.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Features:</h4>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Centered on screen</li>
              <li>Semi-transparent backdrop</li>
              <li>Smooth animations</li>
              <li>Keyboard accessible</li>
              <li>Focus trap enabled</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={basicPopup.close}>
              Got it!
            </Button>
          </div>
        </div>
      </PopupCard>

      <PopupCard
        isOpen={scrollablePopup.isOpen}
        onClose={scrollablePopup.close}
        title="Scrollable Content"
        maxWidth="600px"
        maxHeight="70vh"
        aria-label="Scrollable content example"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            This pop-up demonstrates scrollable content when the content exceeds
            the maximum height. Try scrolling to see more content below.
          </p>

          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Section {i + 1}</h3>
              <p className="text-slate-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                aliquip ex ea commodo consequat.
              </p>
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button onClick={scrollablePopup.close} variant="outline">
              Cancel
            </Button>
            <Button onClick={scrollablePopup.close}>
              Done
            </Button>
          </div>
        </div>
      </PopupCard>

      <PopupCard
        isOpen={formPopup.isOpen}
        onClose={formPopup.close}
        title="Contact Form"
        maxWidth="500px"
        closeOnOverlayClick={false}
        aria-label="Contact form"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter your message"
              required
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              This form cannot be closed by clicking outside. Use the X button or submit the form.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={formPopup.close} variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </PopupCard>

      <PopupCard
        isOpen={confirmPopup.isOpen}
        onClose={confirmPopup.close}
        title="Confirm Action"
        maxWidth="450px"
        showCloseButton={false}
        closeOnOverlayClick={false}
        closeOnEscape={false}
        aria-label="Confirmation dialog"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Are you sure?</h3>
              <p className="text-slate-600">
                This action cannot be undone. This will permanently delete the item
                and remove all associated data from our servers.
              </p>
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              <strong>Note:</strong> This confirmation dialog has no close button and
              cannot be dismissed with Escape or by clicking outside. You must make a choice.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={confirmPopup.close}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert('Action confirmed!');
                confirmPopup.close();
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      </PopupCard>
    </div>
  );
}

export function QuickExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Pop-up
      </Button>

      <PopupCard
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Quick Example"
      >
        <div className="space-y-4">
          <p>This is a quick example of the PopupCard component.</p>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </PopupCard>
    </>
  );
}
