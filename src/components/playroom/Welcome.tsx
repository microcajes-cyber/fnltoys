'use client';
import { useEffect } from 'react';
import Modal from './Modal';
import { Brand, CategoryArt, Icon } from './Art';

export default function Welcome({
  open,
  motion,
  onClose,
}: {
  open: boolean;
  motion: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const duration = motion ? (window.matchMedia('(max-width:680px)').matches ? 2200 : 2700) : 950;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [open, motion, onClose]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Welcome to FNL Toys"
      closeLabel="Skip intro"
      className={`welcome-intro ${motion ? 'intro-animated' : 'intro-static'}`}
    >
      <div className="intro-surface">
        <div className="intro-content">
          <div className="intro-brand" aria-hidden="true">
            <Brand />
          </div>
          <div className="intro-playroom" aria-hidden="true">
            <div className="intro-floor-shadow" />
            <span className="intro-orbit hippo">
              <CategoryArt slug="hippo-fence" size={44} />
            </span>
            <span className="intro-orbit octopus">
              <CategoryArt slug="octopus-fence" size={44} />
            </span>
            <span className="intro-spark one">
              <Icon name="spark" size={30} />
            </span>
            <span className="intro-spark two">
              <Icon name="spark" size={25} />
            </span>
            <div className="intro-arch">
              <div className="intro-room">
                <span className="intro-toy books">
                  <CategoryArt slug="carrot-bookshelf" size={103} />
                </span>
                <span className="intro-toy rack">
                  <CategoryArt slug="storage-rack" size={103} />
                </span>
                <span className="intro-toy fence">
                  <CategoryArt slug="party-fence" size={115} />
                </span>
                <span className="intro-toy balls">
                  <CategoryArt slug="ocean-balls" size={76} />
                </span>
              </div>
              <div className="intro-door left">
                <span className="intro-door-mark">
                  <Icon name="spark" size={35} />
                </span>
              </div>
              <div className="intro-door right">
                <span className="intro-door-mark">
                  <Icon name="heart" size={34} />
                </span>
              </div>
            </div>
          </div>
          <div className="intro-message">
            <span className="intro-kicker">Welcome to the playroom</span>
            <h2>
              A little world <span>of play.</span>
            </h2>
            <p>Come on in. Make room for imagination.</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
