import {
  FacePackage,
  getFacePackageById,
  getFacePackages,
  getImageUrl,
  IdType,
  ImageMessageSegment,
} from 'api';
import { Switch } from 'components/switch';
import { useNavigator } from 'components/switch-host';
import { firstItemOrDefault } from 'helpers/list-helpers';
import { useConstant } from 'hooks';
import { IRxState, RxState, RxStateCluster } from 'hooks/rx-state';
import { useRxValue } from 'hooks/use-rx';
import { fallbackHttpApi } from 'models/store';
import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as FaceIcon } from 'images/face.svg';
import classNames from 'classnames';

const SWITCH_NAME = 'chat/face-panel';

type Faces = ReadonlyArray<ImageMessageSegment>;
type Props = {
  className?: string;
};

export default function FacePanelPopupButton({ className }: Props) {
  const [toggle, setToggle] = useState(false);
  const [hover, setHover] = useState(false);

  const buttonClass = classNames('FacePanelPopupButton', className, { toggle, hover });
  return (
    <button
      className={buttonClass}
      onClick={() => setToggle((prev) => !prev)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onBlur={() => setToggle(false)}
    >
      <FaceIcon className="FacePanelPopupButton__icon" />
      <FacePanelPopup />
    </button>
  );
}

function FacePanelPopup() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const facePackages = useAsyncConstant<ReadonlyArray<FacePackage>>(
    () => fallbackHttpApi(getFacePackages, []),
    []
  );
  const facePackagesCluster = useConstant(() => {
    const factory = (facePackageId: IdType) =>
      new RxState<Faces>([], async (set) => {
        const value = await fallbackHttpApi(() => getFacePackageById(facePackageId), []);
        set(value);
      });
    return new RxStateCluster<IdType, Faces>(factory);
  });

  const naviagtor = useNavigator(SWITCH_NAME);
  useEffect(() => {
    const facePackage = facePackages[selectedIndex];
    if (facePackage) {
      naviagtor(facePackage.id);
    }
  }, [facePackages, naviagtor, selectedIndex]);

  return (
    <div
      className="FacePanelPopup"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
    >
      <div className="FacePanelPopup__content">
        <Switch
          name={SWITCH_NAME}
          contentProvider={{
            isValidLabel: (facePackageId) => facePackages.some((item) => item.id === facePackageId),
            getRenderer: (facePackageId) => () => (
              <FaceList facesState={facePackagesCluster.get(facePackageId)} />
            ),
          }}
        />
      </div>
      <div className="FacePanelPopup__tabHeaders">
        {facePackages.map((item, index) => (
          <FaceHeader
            selected={selectedIndex === index}
            facesState={facePackagesCluster.get(item.id)}
            displayFaceId={item.displayFaceId}
            onSelected={() => setSelectedIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

type FacesStateProps = {
  facesState: IRxState<Faces>;
};

type FaceHeaderProps = FacesStateProps & {
  selected: boolean;
  displayFaceId?: IdType;

  onSelected: () => void;
};

function FaceHeader({ facesState, selected, displayFaceId, onSelected }: FaceHeaderProps) {
  const faces = useRxValue(facesState);
  const displayFace = useMemo(() => {
    return displayFaceId
      ? faces.find((item) => item.imageId === displayFaceId) && firstItemOrDefault(faces)
      : firstItemOrDefault(faces);
  }, [displayFaceId, faces]);
  const headerClass = classNames('FacePanelPopup__faceHeader', { selected });

  return (
    <div className={headerClass} onClick={onSelected}>
      {displayFace ? (
        <img
          className="FacePanelPopup__faceHeaderImage"
          src={getImageUrl(displayFace.imageId)}
          alt="header"
        />
      ) : null}
    </div>
  );
}

function FaceList({ facesState }: FacesStateProps) {
  const faces = useRxValue(facesState);
  return (
    <div className="FacePanelPopup__faceList">
      {faces.map((item) => {
        const { imageId, displayName } = item;
        const imageUrl = getImageUrl(imageId);

        return (
          <div key={imageId} className="FacePanelPopup__faceItem">
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

// TODO: Extract to general hooks
function useAsyncConstant<T>(provider: () => Promise<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);
  useEffect(() => {
    const fetch = async () => setValue(await provider());

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
