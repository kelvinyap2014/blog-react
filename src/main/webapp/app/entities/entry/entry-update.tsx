import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, setFileData, byteSize, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IBlog } from 'app/shared/model/blog.model';
import { getEntities as getBlogs } from 'app/entities/blog/blog.reducer';
import { ITag } from 'app/shared/model/tag.model';
import { getEntities as getTags } from 'app/entities/tag/tag.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './entry.reducer';
import { IEntry } from 'app/shared/model/entry.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { keysToValues } from 'app/shared/util/entity-utils';

export interface IEntryUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IEntryUpdateState {
  isNew: boolean;
  idstag: any[];
  blogId: number;
}

export class EntryUpdate extends React.Component<IEntryUpdateProps, IEntryUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idstag: [],
      blogId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getBlogs();
    this.props.getTags();
  }

  onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => this.props.setBlob(name, data, contentType), isAnImage);
  };

  clearBlob = name => () => {
    this.props.setBlob(name, undefined, undefined);
  };

  saveEntity = (event, errors, values) => {
    values.date = new Date(values.date);

    if (errors.length === 0) {
      const { entryEntity } = this.props;
      const entity = {
        ...entryEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/entry');
  };

  blogUpdate = element => {
    const name = element.target.value.toString();
    if (name === '') {
      this.setState({
        blogId: -1
      });
    } else {
      for (const i in this.props.blogs) {
        if (name === this.props.blogs[i].name.toString()) {
          this.setState({
            blogId: this.props.blogs[i].id
          });
        }
      }
    }
  };

  tagUpdate = element => {
    const selected = Array.from(element.target.selectedOptions).map((e: any) => parseInt(e.value, 10));
    this.setState({
      idstag: keysToValues(selected, this.props.tags, 'name')
    });
  };

  displaytag(value: any) {
    if (this.state.idstag && this.state.idstag.length !== 0) {
      const list = [];
      for (const i in this.state.idstag) {
        if (this.state.idstag[i]) {
          list.push(this.state.idstag[i].name);
        }
      }
      return list;
    }
    if (value.tags && value.tags.length !== 0) {
      const list = [];
      for (const i in value.tags) {
        if (value.tags[i]) {
          list.push(value.tags[i].name);
        }
      }
      this.setState({
        idstag: keysToValues(list, this.props.tags, 'name')
      });
      return list;
    }
    return null;
  }

  render() {
    const { entryEntity, blogs, tags, loading, updating } = this.props;
    const { isNew } = this.state;

    const { content } = entryEntity;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="blogApp.entry.home.createOrEditLabel">
              <Translate contentKey="blogApp.entry.home.createOrEditLabel">Create or edit a Entry</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : entryEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="entry-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="title">
                    <Translate contentKey="blogApp.entry.title">Title</Translate>
                  </Label>
                  <AvField
                    id="entry-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="contentLabel" for="content">
                    <Translate contentKey="blogApp.entry.content">Content</Translate>
                  </Label>
                  <AvInput
                    id="entry-content"
                    type="textarea"
                    name="content"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="dateLabel" for="date">
                    <Translate contentKey="blogApp.entry.date">Date</Translate>
                  </Label>
                  <AvInput
                    id="entry-date"
                    type="datetime-local"
                    className="form-control"
                    name="date"
                    value={isNew ? null : convertDateTimeFromServer(this.props.entryEntity.date)}
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="blog.name">
                    <Translate contentKey="blogApp.entry.blog">Blog</Translate>
                  </Label>
                  <AvInput id="entry-blog" type="select" className="form-control" name="blog.name" onChange={this.blogUpdate}>
                    <option value="" key="0" />
                    {blogs
                      ? blogs.map(otherEntity => (
                          <option value={otherEntity.name} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="tags">
                    <Translate contentKey="blogApp.entry.tag">Tag</Translate>
                  </Label>
                  <AvInput
                    id="entry-tag"
                    type="select"
                    multiple
                    className="form-control"
                    name="faketags"
                    value={this.displaytag(entryEntity)}
                    onChange={this.tagUpdate}
                  >
                    <option value="" key="0" />
                    {tags
                      ? tags.map(otherEntity => (
                          <option value={otherEntity.name} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                  <AvInput id="entry-tag" type="hidden" name="tags" value={this.state.idstag} />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/entry" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  blogs: storeState.blog.entities,
  tags: storeState.tag.entities,
  entryEntity: storeState.entry.entity,
  loading: storeState.entry.loading,
  updating: storeState.entry.updating
});

const mapDispatchToProps = {
  getBlogs,
  getTags,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntryUpdate);
