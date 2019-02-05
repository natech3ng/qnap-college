import { EventBrokerService } from './../../_services/event.broker.service';
import { CommentService } from './../../_services/comment.service';
import { UsersService } from './../../auth/_services/users.service';
import { AuthService } from './../../auth/_services/auth.service';
import { CourseDoc } from './../../_models/document';
import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course } from '../../_models/course';
import { CourseService } from '../../_services/course.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddThisService } from '../../_services/addthis.service';
import { MetaService } from '@ngx-meta/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ReCaptchaV3Service, InvisibleReCaptchaComponent } from 'ngx-captcha';
import { ConfirmService } from '../../_services/confirm.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, OnDestroy, AfterViewInit {

  sub: Subscription;
  routeSub: Subscription;
  addThisSub: Subscription;
  course: Course;
  courses: Course [];
  youtubeSrc;
  keywords;
  comments: any [];
  currentUser = null;
  loggedIn:boolean = false;
  returnUrl = '';
  currentUserAbbvName = 'JD';
  commentError: boolean = false;
  commentErrorMessage: string = 'Please make sure the comment format is correct.';
  private cdr: ChangeDetectorRef;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaResponse?: string;
  public captchaIsReady = false;

  public badge: 'bottomleft' | 'bottomright' | 'inline' = 'inline';
  public type: 'image' | 'audio';

  public recaptcha: any = null;

  comment = '';

  @ViewChild('captchaElem') captchaElem: InvisibleReCaptchaComponent;
  @ViewChild('langInput') langInput: ElementRef;

  public readonly siteKey = environment.recapctchaSitekey;
  recaptchaToken = null;
  // siteKey = '6LeVt3cUAAAAADO9qIyWsIHZOaiFUKr0PwWvVes9';

  loading: boolean = false;

  constructor(
    private _route: ActivatedRoute, 
    private _courseService: CourseService, 
    private _router: Router,
    private _addThis: AddThisService,
    private readonly _meta: MetaService,
    private _fb: FacebookService,
    private _toastr: ToastrService,
    private _authService: AuthService,
    private _usersService: UsersService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private _commentService: CommentService,
    private _eventBroker: EventBrokerService, 
    private _confirmService: ConfirmService) {

    let initParams: InitParams = {
      appId: '482418502252290',
      xfbml: true,
      version: 'v3.1'
    };

    this._fb.init(initParams);
    
    this._courseService.all(4, 'watched').subscribe(
      (coursedoc: CourseDoc) => {
        this.courses = coursedoc.docs;
      },
      (error) => {
        console.log('Something went wrong');
      }
    );

    this.keywords = '';
  }

  ngOnInit() {

    this._meta.setTitle('Course Course Course');
    this._meta.setTag('og:image', '//img.youtube.com/vi/tcGIYGr4guA/sddefault.jpg');
    this._meta.setTag('og:type', 'video.other');
    this._meta.setTag('og:description', 'Course description');
    this._meta.setTag('og:url', 'https://college.qnap.com/course/5b5105d1e449ca649bbc1675');

    this._authService.verify().subscribe(
      (res) => {
        if (res && res.success) {
          this.loggedIn = true;
          this.currentUser = this._authService.getUser();
          console.log(this.currentUser);
          this.currentUserAbbvName = this.currentUser.name.split(" ").map((n)=>n[0]).join("")
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // console.log(this.loggedIn);
    // console.log(this._authService.getUser());
    this.sub = this._route.params.subscribe(params => {
    });

    this.routeSub = this._route.data.subscribe(
      (data: Data) => {
        if (data.course) {
          this.course = data.course;
          this._courseService.quickClicked(this.course);
          this.youtubeSrc = 'https://www.youtube.com/embed/' + this.course.youtube_ref;
          this.course.tags = this.course.keywords.split(',');
          // console.log(this.course);

          this._courseService.allCommentsByCourseId(this.course._id).subscribe(
            (comments) => {
              this.comments = comments;
              let i = 0;
              for (let comment of this.comments) {
                let idx = i;
                this._usersService.getAbbv(comment['owner_id']).subscribe(
                  (res) => {
                    this.comments[idx]['poster_name'] = res['name'];
                    // console.log(idx);
                    // console.log(this.comments);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                i++;
              }
            },
            (error) => {
              this._toastr.error('Couldn\'t get comments')
            }
          );
          // this._meta.setTitle(`${this.course.title}`);
          // this._meta.setTag('og:image', `//img.youtube.com/vi/${this.course.youtube_ref}/sddefault.jpg`);
          // let params: UIParams = {
          //   method: 'share_open_graph',
          //   action_type: 'og.shares',
          //   action_properties: JSON.stringify({
          //     object : {
          //       'og:url': `//college.qnap.com/course/${this.course._id}`, // your url to share
          //       'og:title': `${this.course.title}`,
          //       'og:site_name': 'QNAP College',
          //       'og:description': `${this.course.desc}`,
          //       'og:image': `//img.youtube.com/vi/${this.course.youtube_ref}/sddefault.jpg`,//
          //       'og:image:width':'250',//size of image in pixel
          //       'og:image:height':'257',
          //       'og:image:type': 'image/jpeg'
          //     }
          //   })
          // }
          // console.log(params);
          // this._fb.ui(params)
          //   .then((res: UIResponse) => 
          //   {
          //     console.log("dadedadeada");
          //     console.log(res)
          //   })
          //   .catch((e: any) => 
          //   {
          //     console.log("dadeada");
          //     console.error(e)
          //   });;
        }
      });

    this.returnUrl = this._route.snapshot['_routerState'].url;
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    this.addThisSub = this._addThis.initAddThis('ra-5a0dd7aa711366bd', false).subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.routeSub.unsubscribe();
    this.addThisSub.unsubscribe();
    this._meta.removeTag('property="og:type"');
  }

  onSubmit(f: NgForm) {
    this._router.navigate(['/search', f.value.keywords]);
  }

  checkForScript() {
    let scriptOnPage = false;
    const selector = 'script[src*="addthis_widget.js"]';
    const matches = document.querySelectorAll(selector);
    if(matches.length > 0) {
        scriptOnPage = true;
    }
    return scriptOnPage;
  }

  onSignout(e) {
    e.stopPropagation();
    // remove user from local storage to log user out
    this.loggedIn = false;
    localStorage.removeItem('currentUser');
    // this._authService.logout();
  }

  addScript() {
    // if script is already on page, do nothing
    if (this.checkForScript()) {
      return;
    }

    const profileId = 'ra-5a0dd7aa711366bd';
    const baseUrl = '//s7.addthis.com/js/300/addthis_widget.js';
    const scriptInFooter = true;
    var url;

    if(profileId) {
        // preference the site's profile ID in the URL, if available
        url = baseUrl + '#pubid=' + profileId;
    } else {
        url = baseUrl;
    }

    // create SCRIPT element
    let script = document.createElement('script');
    script.src = url;

    // append SCRIPT element

    if(scriptInFooter !== true && typeof document.head === 'object') {
      document.head.appendChild(script);
    } else {
      document.body.appendChild(script);
    }
  };

  setloading(value: boolean) {
    this._eventBroker.emit<boolean>("loading", value);
  }

  onEnterComment(e) {
    
    console.log(e.keyCode);
    let comment_html = e.target.value;
    comment_html = comment_html.replace(/\r?\n/g, '<br />');
    // console.log(this.comment);
    this.setloading(true);
    this.reCaptchaV3Service.execute(this.siteKey, 'postcomment', (token) => {
      // console.log('This is your token: ', token);
      this.recaptchaToken = token

      if(e.target.value.length < 32) {
        this.commentErrorMessage = 'The comment must be longer than 32 characters.';
        this.commentError = true;
        this.setloading(false);
        return;
      } else {
        this.commentError = false;
      }
      this._commentService.post(this.course._id, comment_html, this.recaptchaToken).subscribe(
        (res) => {
          
          // console.log(res);
          this.comment = '';

          this._courseService.allCommentsByCourseId(this.course._id).subscribe(
            (comments) => {
              this.comments = comments;
              let i = 0;
              for (let comment of this.comments) {
                let idx = i;
                this._usersService.getAbbv(comment['owner_id']).subscribe(
                  (res) => {
                    this.comments[idx]['poster_name'] = res['name'];
                    // console.log(idx);
                    // console.log(this.comments);
                  },
                  (err) => {
                    console.log(err);
                  }
                );
                i++;
              }
            },
            (error) => {
              this._toastr.error('Couldn\'t get comments')
            });
          this.setloading(false);
        },
        (err) => {
          console.log(err);
          this.comment = '';
          this.setloading(false);
        }
      );
    }, {
      useGlobalDomain: false // optional
    });
  }

  onCommentCheckBlur(e) {
    if(e.target.value.length < 32 && e.target.value.length > 0) {
      this.commentErrorMessage = 'The comment must be longer than 32 characters.';
      this.commentError = true;
    } else {
      this.commentError = false;
    }
  }

  onCommentCheckChange(e) {
    if(this.commentError) {
      if(e.target.value.length >= 32 || e.target.value.length === 0) {
        this.commentError = false;
      }
    }
  }
  onDelete(commentId) {
    this._confirmService.open("Do you want to delete the comment?").then(
      () => {
        this.setloading(true);
        setTimeout(() => {
          this._commentService.delete(commentId).subscribe(
            (res) => { 
              if (res && res.success) {
                for (let i = 0; i < this.comments.length; i = i+1) {
                  if (commentId === this.comments[i]._id) {
                    const coms = this.comments.slice();
                    coms.splice(i, 1);
                    this.comments = coms;
                  }
                }
                this.setloading(false);
                this._toastr.success('Successfully deleted the comment');
              } else {
                this.setloading(false);
                this._toastr.success('Nothing happened');
              }
            },
            (err) => {
              this.loading = false;
              this._toastr.error('Something went wrong.')
            }
          ); 
        }, 1000)  
    }).catch(()=>{})
  }

  execute(): void {
    this.captchaElem.execute();
  }

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
  }

  handleReady(): void {
    this.captchaIsReady = true;
  }
};