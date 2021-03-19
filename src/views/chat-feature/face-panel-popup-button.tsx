import { getImageUrl, IdType, ImageMessageSegment } from 'api';
import { Switch } from 'components/switch';
import { useNavigator } from 'components/switch-host';
import { firstItemOrDefault } from 'helpers/list-helpers';
import { useConstant } from 'hooks';
import { useFacePackages, useFaceSet } from 'models/store';
import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as FaceIcon } from 'images/face.svg';
import classNames from 'classnames';
import { uuidv4 } from 'helpers';

const SWITCH_NAME_BASE = 'chat/face-panel';

type Props = {
  className?: string;

  onSelectedFace: (face: ImageMessageSegment) => void;
};

export default function FacePanelPopupButton({ className, onSelectedFace }: Props) {
  const [toggle, setToggle] = useState(false);
  const [hover, setHover] = useState(false);

  const buttonClass = classNames('FacePanelPopupButton', className, { toggle, hover });
  return (
    <button
      className={buttonClass}
      onClick={() => setToggle(prev => !prev)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onBlur={() => setToggle(false)}
    >
      <FaceIcon className="FacePanelPopupButton__icon" />
      <FacePanelPopup
        onSelectedFace={item => {
          onSelectedFace(item);
          setToggle(false);
        }}
      />
    </button>
  );
}

type FacePanelPopupProps = {
  onSelectedFace: (face: ImageMessageSegment) => void;
};

function FacePanelPopup({ onSelectedFace }: FacePanelPopupProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const facePackages = useFacePackages();

  const switchName = useConstant(() => `${SWITCH_NAME_BASE}-${uuidv4()}`);
  const naviagtor = useNavigator(switchName);
  useEffect(() => {
    const facePackage = facePackages[selectedIndex];
    if (facePackage) {
      naviagtor(facePackage.id);
    }
  }, [facePackages, naviagtor, selectedIndex]);

  return (
    <div
      className="FacePanelPopup"
      onClick={e => e.stopPropagation()}
      onMouseEnter={e => e.stopPropagation()}
      onMouseLeave={e => e.stopPropagation()}
    >
      <div className="FacePanelPopup__content">
        <Switch
          name={switchName}
          contentProvider={{
            isValidLabel: facePackageId => facePackages.some(item => item.id === facePackageId),
            getRenderer: facePackageId => () => (
              <FaceList facePackageId={facePackageId} onSelectedFace={onSelectedFace} />
            ),
          }}
        />
      </div>
      <div className="FacePanelPopup__tabHeaders">
        {facePackages.map((item, index) => (
          <FaceHeader
            key={item.id}
            selected={selectedIndex === index}
            facePackageId={item.id}
            displayFaceId={item.displayFaceId}
            onSelected={() => setSelectedIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

type FacesStateProps = {
  facePackageId: IdType;
};

type FaceHeaderProps = FacesStateProps & {
  selected: boolean;
  displayFaceId?: IdType;
  onSelected: () => void;
};

type FaceListProps = FacesStateProps & {
  onSelectedFace: (face: ImageMessageSegment) => void;
};

function FaceHeader({ facePackageId, selected, displayFaceId, onSelected }: FaceHeaderProps) {
  const faceSet = useFaceSet(facePackageId);
  const iconId = useMemo(() => {
    if (displayFaceId) {
      let result = faceSet.find(item => item.imageId === displayFaceId);
      return result ? result.imageId : displayFaceId;
    }

    return firstItemOrDefault(faceSet)?.imageId;
  }, [displayFaceId, faceSet]);
  const headerClass = classNames('FacePanelPopup__faceHeader', { selected });

  return (
    <div className={headerClass} onClick={onSelected}>
      {iconId ? (
        <img className="FacePanelPopup__faceHeaderImage" src={getImageUrl(iconId)} alt="header" />
      ) : null}
    </div>
  );
}

function FaceList({ facePackageId, onSelectedFace }: FaceListProps) {
  const faceSet = useFaceSet(facePackageId);
  return (
    <div className="FacePanelPopup__faceList">
      {faceSet.map(item => {
        const { imageId, displayName } = item;
        const imageUrl = getImageUrl(imageId);

        return (
          <div
            key={imageId}
            className="FacePanelPopup__faceItem"
            onClick={() => onSelectedFace(item)}
          >
            <img
              className="FacePanelPopup__faceImage"
              src={imageUrl}
              alt={displayName || imageId}
            />
          </div>
        );
      })}
    </div>
  );
}
